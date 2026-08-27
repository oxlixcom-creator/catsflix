/*
# ONYX STORE — Add Missing Foreign Key Indexes

Adds indexes for foreign key columns that were flagged by the performance advisor.
These improve query performance for:
- addresses.user_id (user profile lookups)
- cart_items.product_id (cart joins)
- order_items.product_id (order detail joins)
- order_items.order_id (already indexed, but ensuring)
- reviews.user_id (user review lookups)
- wishlist_items.product_id (wishlist joins)
*/

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);
