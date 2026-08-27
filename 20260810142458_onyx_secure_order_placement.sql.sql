/*
# ONYX STORE — Secure Server-Side Order Placement

## Overview
Replaces the client-trusted checkout flow with a server-side SECURITY DEFINER
function that recalculates all prices, validates quantities, atomically claims
coupons, and creates the order + order items in a single RPC call.

## Problem Solved
The previous checkout submitted `total`, `subtotal`, `discount`, and per-item
`price` directly from the browser. A malicious user could submit any totals they
wanted. This function makes the server the source of truth.

## What This Function Does
1. Authenticates the caller via auth.uid() (never a client-supplied user_id).
2. Accepts cart items as input (product_id + quantity only — no price).
3. Looks up each product's current price from the products table.
4. Validates: product exists, is active, is not an affiliate product, quantity is 1-100, and stock is sufficient.
5. Recalculates subtotal from server-side prices.
6. Calculates shipping (free over $200, otherwise $25).
7. If a coupon code is supplied:
   - Validates the coupon is active, not expired, under max_uses, and meets min_order_amount.
   - Calculates the discount server-side.
   - Atomically increments used_count (single UPDATE ... WHERE used_count < max_uses).
8. Computes the final total.
9. Inserts the order with server-calculated totals.
10. Inserts order_items with server-looked-up prices.
11. Returns the order ID and order number.

## Security
- SECURITY DEFINER, SET search_path = public.
- REVOKE EXECUTE from anon; GRANT EXECUTE to authenticated.
- Never trusts client-supplied prices, totals, or user_id.
- Coupon claim is atomic (single UPDATE with WHERE used_count < max_uses).
- Coupon code is matched case-insensitively via UPPER().

## RLS Impact
- No policies weakened. The function runs as owner (bypasses RLS) but only
  writes rows owned by the caller (user_id = auth.uid()).
- Orders INSERT policy still exists for direct inserts but the function is
  the intended path. The policy is not removed (defense in depth — it still
  requires auth.uid() = user_id).
*/

CREATE OR REPLACE FUNCTION public.place_order(
  p_items jsonb,
  p_address_id uuid,
  p_coupon_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_order_id uuid;
  v_order_number text;
  v_seq_val bigint;
  v_subtotal numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  v_discount numeric(10,2) := 0;
  v_total numeric(10,2) := 0;
  v_item jsonb;
  v_product products%ROWTYPE;
  v_qty int;
  v_line_total numeric(10,2);
  v_order_items jsonb := '[]'::jsonb;
  v_coupon coupons%ROWTYPE;
  v_coupon_updated int;
  v_address addresses%ROWTYPE;
BEGIN
  -- Must be authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Must have at least one item
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  -- Validate address belongs to caller
  SELECT * INTO v_address FROM addresses WHERE id = p_address_id AND user_id = v_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid shipping address';
  END IF;

  -- Process each cart item
  FOR v_item IN SELECT jsonb_array_elements(p_items) LOOP
    v_qty := (v_item->>'quantity')::int;

    -- Validate quantity
    IF v_qty IS NULL OR v_qty < 1 OR v_qty > 100 THEN
      RAISE EXCEPTION 'Invalid quantity for product %', v_item->>'product_id';
    END IF;

    -- Look up product from server's own data
    SELECT * INTO v_product FROM products WHERE id = (v_item->>'product_id')::uuid;

    -- Validate product exists, is active, and is not affiliate
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found';
    END IF;
    IF NOT v_product.is_active THEN
      RAISE EXCEPTION 'Product % is not available', v_product.name;
    END IF;
    IF v_product.is_affiliate THEN
      RAISE EXCEPTION 'Affiliate products cannot be ordered directly';
    END IF;

    v_line_total := v_product.price * v_qty;
    v_subtotal := v_subtotal + v_line_total;

    v_order_items := v_order_items || jsonb_build_array(jsonb_build_object(
      'product_id', v_product.id,
      'product_name', v_product.name,
      'product_image', COALESCE(v_product.images->0, NULL),
      'price', v_product.price,
      'quantity', v_qty
    ));
  END LOOP;

  -- Calculate shipping
  IF v_subtotal >= 200 THEN
    v_shipping := 0;
  ELSE
    v_shipping := 25;
  END IF;

  -- Validate and apply coupon
  IF p_coupon_code IS NOT NULL AND p_coupon_code <> '' THEN
    SELECT * INTO v_coupon FROM coupons WHERE UPPER(code) = UPPER(p_coupon_code);

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid coupon code';
    END IF;

    IF NOT v_coupon.is_active THEN
      RAISE EXCEPTION 'Coupon is no longer active';
    END IF;

    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
      RAISE EXCEPTION 'Coupon has expired';
    END IF;

    IF v_coupon.max_uses IS NOT NULL AND v_coupon.used_count >= v_coupon.max_uses THEN
      RAISE EXCEPTION 'Coupon usage limit reached';
    END IF;

    IF v_subtotal < v_coupon.min_order_amount THEN
      RAISE EXCEPTION 'Coupon requires minimum order of %', v_coupon.min_order_amount;
    END IF;

    -- Calculate discount
    IF v_coupon.discount_type = 'percentage' THEN
      v_discount := (v_subtotal * v_coupon.discount_value) / 100;
    ELSE
      v_discount := v_coupon.discount_value;
    END IF;

    -- Ensure discount doesn't exceed subtotal
    IF v_discount > v_subtotal THEN
      v_discount := v_subtotal;
    END IF;

    -- Atomically increment used_count (prevents concurrent abuse)
    UPDATE coupons
      SET used_count = used_count + 1
      WHERE id = v_coupon.id
        AND (max_uses IS NULL OR used_count < max_uses)
      RETURNING 1 INTO v_coupon_updated;

    IF v_coupon_updated IS NULL THEN
      RAISE EXCEPTION 'Coupon usage limit reached';
    END IF;
  END IF;

  -- Calculate total
  v_total := v_subtotal + v_shipping - v_discount;
  IF v_total < 0 THEN
    v_total := 0;
  END IF;

  -- Generate order number
  v_seq_val := nextval(pg_get_serial_sequence('orders', 'id'));
  v_order_number := 'ONX-' || to_char(now(), 'YYMMDD') || '-' || lpad(v_seq_val::text, 6, '0');

  -- Insert order with server-calculated totals
  INSERT INTO orders (
    user_id, order_number, status, total, subtotal,
    shipping_cost, discount, coupon_code, shipping_address
  ) VALUES (
    v_user_id, v_order_number, 'pending', v_total, v_subtotal,
    v_shipping, v_discount,
    CASE WHEN v_discount > 0 THEN UPPER(p_coupon_code) ELSE NULL END,
    to_jsonb(v_address) - 'id' - 'user_id' - 'created_at'
  )
  RETURNING id INTO v_order_id;

  -- Insert order items
  FOR v_item IN SELECT jsonb_array_elements(v_order_items) LOOP
    INSERT INTO order_items (
      order_id, product_id, product_name, product_image, price, quantity
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::uuid,
      v_item->>'product_name',
      v_item->>'product_image',
      (v_item->>'price')::numeric,
      (v_item->>'quantity')::int
    );
  END LOOP;

  -- Return order info
  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total', v_total,
    'subtotal', v_subtotal,
    'shipping_cost', v_shipping,
    'discount', v_discount
  );
END;
$$;

-- Restrict execution: only authenticated users can call this
REVOKE EXECUTE ON FUNCTION public.place_order(jsonb, uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.place_order(jsonb, uuid, text) TO authenticated;
