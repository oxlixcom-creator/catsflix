/*
# ONYX STORE — Revoke PUBLIC Execute on place_order

The SECURITY DEFINER function place_order was callable by the anon role because
Postgres grants EXECUTE to PUBLIC by default when a function is created. The
previous REVOKE from anon was insufficient — we must also REVOKE from PUBLIC.

This ensures only authenticated users can call place_order.
*/

REVOKE EXECUTE ON FUNCTION public.place_order(jsonb, uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.place_order(jsonb, uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.place_order(jsonb, uuid, text) TO authenticated;
