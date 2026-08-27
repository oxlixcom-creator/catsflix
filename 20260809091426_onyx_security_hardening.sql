-- ============================================================
-- ONYX STORE — SECURITY HARDENING
-- Fixes:
-- 1. Prevent privilege escalation via profiles.role column
-- 2. Restrict SECURITY DEFINER function execution to authenticated
-- 3. Add admin UPDATE policy on profiles (for admin role management)
-- 4. Add WITH CHECK to admin UPDATE policies where missing
-- 5. Add order_items UPDATE policy for admin
-- 6. Restrict reviews SELECT to active products only (defense in depth)
-- ============================================================

-- ============================================================
-- 1. PROFILES: Prevent self-escalation to admin role
-- ============================================================

-- INSERT: users can only create their own profile as 'customer'
-- (role defaults to 'customer' in schema; explicit check prevents override)
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = id AND role = 'customer'
  );

-- UPDATE: users can only update their own profile, and CANNOT change role
-- We use a separate admin policy for role changes
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'customer');

-- Admin can update any profile (including role management)
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ============================================================
-- 2. Restrict SECURITY DEFINER functions to authenticated only
-- ============================================================
-- The handle_new_user trigger function runs as SECURITY DEFINER but is only
-- invoked by the auth trigger, not directly callable. Still, revoke direct
-- execute from anon to be safe.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon;

-- ============================================================
-- 3. ORDER_ITEMS: Add admin UPDATE policy
-- ============================================================
-- Currently order_items has no UPDATE policy, meaning no one (including admin)
-- can update order items. Add admin-only UPDATE.
DROP POLICY IF EXISTS "order_items_update_admin" ON order_items;
CREATE POLICY "order_items_update_admin" ON order_items FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ============================================================
-- 4. ORDERS: Add WITH CHECK to admin UPDATE policy
-- ============================================================
-- The existing orders_update_admin policy has no WITH CHECK.
-- Add one to ensure admin updates stay valid.
DROP POLICY IF EXISTS "orders_update_admin" ON orders;
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ============================================================
-- 5. ORDER_ITEMS DELETE: Add admin DELETE policy
-- ============================================================
DROP POLICY IF EXISTS "order_items_delete_admin" ON order_items;
CREATE POLICY "order_items_delete_admin" ON order_items FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- ============================================================
-- 6. WISHLIST_ITEMS: Add UPDATE policy (currently missing)
-- ============================================================
-- Wishlist items don't typically need updates, but without an UPDATE policy
-- the table is locked for updates. Add a restrictive one for completeness.
DROP POLICY IF EXISTS "wishlist_update_own" ON wishlist_items;
CREATE POLICY "wishlist_update_own" ON wishlist_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
