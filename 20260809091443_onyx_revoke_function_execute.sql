-- ============================================================
-- Revoke EXECUTE on SECURITY DEFINER functions from PUBLIC
-- PostgreSQL grants EXECUTE to PUBLIC by default for functions.
-- These functions are trigger/internal only and should never be
-- called via the REST API (PostgREST /rpc/ endpoint).
-- ============================================================

-- handle_new_user: only called by the auth trigger, never via RPC
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- generate_order_number: internal function for order number generation,
-- not called via RPC in the current application
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM authenticated;
