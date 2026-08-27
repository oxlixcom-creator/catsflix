-- ============================================================
-- ONYX STORE — AFFILIATE PRODUCT FIELDS
-- Adds affiliate-specific columns to the products table.
-- All columns are nullable so existing owned products are unaffected.
-- ============================================================

-- brand: product brand/manufacturer
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand text;

-- is_affiliate: true when this product is sold via an external affiliate link
-- rather than directly by ONYX. Defaults to false for existing owned inventory.
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_affiliate boolean NOT NULL DEFAULT false;

-- affiliate_url: the authorized external link the customer is sent to.
-- Treated as untrusted — validated in application code before use.
ALTER TABLE products ADD COLUMN IF NOT EXISTS affiliate_url text;

-- source_store: human-readable name of the external retailer
-- (e.g. "Amazon", "Shopify Partner", "Authorized Reseller")
ALTER TABLE products ADD COLUMN IF NOT EXISTS source_store text;

-- external_product_id: the partner's product identifier for reconciliation
ALTER TABLE products ADD COLUMN IF NOT EXISTS external_product_id text;

-- availability: free-text status from the affiliate feed
-- (e.g. "in_stock", "out_of_stock", "limited")
ALTER TABLE products ADD COLUMN IF NOT EXISTS availability text DEFAULT 'in_stock';

-- updated_at: track modifications (trigger keeps it current)
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Index for filtering affiliate vs owned products
CREATE INDEX IF NOT EXISTS idx_products_is_affiliate ON products(is_affiliate) WHERE is_affiliate = true;

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.handle_product_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.handle_product_updated_at();

-- Revoke direct execution of the trigger function from all non-internal roles
REVOKE EXECUTE ON FUNCTION public.handle_product_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_product_updated_at() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_product_updated_at() FROM authenticated;
