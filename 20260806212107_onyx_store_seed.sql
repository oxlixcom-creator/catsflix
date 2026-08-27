/*
# ONYX STORE - Seed Categories & 11 Launch Products

## Overview
Seeds the database with 3 categories (Men, Women, Perfume) and 11 premium products:
- 5 Men's products
- 5 Women's products
- 1 Premium Perfume

All products use high-quality real product images from Pexels.

## Data
### Categories
1. Men (slug: men)
2. Women (slug: women)
3. Perfume (slug: perfume)

### Products (11 total)
Men: Noir Leather Jacket, Onyx Chronograph Watch, Phantom Sneakers, Midnight Leather Bag, Shadow Sunglasses
Women: Noir Silk Dress, Eclipse Handbag, Velvet Stiletto Heels, Obsidian Watch, Midnight Trench Coat
Perfume: Coco Noir Parfum
*/

-- Categories
INSERT INTO categories (slug, name, description, icon_name, sort_order) VALUES
  ('men', 'Men', 'Tailored black garments and accessories for the modern gentleman', 'Shirt', 1),
  ('women', 'Women', 'Elegant black fashion for the bold and beautiful', 'Sparkles', 2),
  ('perfume', 'Perfume', 'Luxury fragrances in their darkest, most refined form', 'Flower', 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name;

-- Products (11 total)
-- MEN (5)
INSERT INTO products (slug, name, description, price, category_id, images, stock, sku, rating, review_count, tag, is_featured) VALUES
(
  'noir-leather-jacket',
  'Noir Leather Jacket',
  'Hand-stitched black lambskin leather jacket with a tailored silhouette. Silver-tone hardware and a satin lining complete this timeless statement piece.',
  1890.00,
  (SELECT id FROM categories WHERE slug = 'men'),
  '["https://images.pexels.com/photos/27074950/pexels-photo-27074950.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  24,
  'MNX-LJ-001',
  4.9,
  214,
  'New',
  true
),
(
  'onyx-chronograph-watch',
  'Onyx Chronograph Watch',
  'Swiss-made chronograph with a black DLC stainless steel case, sapphire crystal, and an alligator leather strap. Water resistant to 100m.',
  12400.00,
  (SELECT id FROM categories WHERE slug = 'men'),
  '["https://images.pexels.com/photos/22032442/pexels-photo-22032442.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  8,
  'MNX-CW-002',
  5.0,
  86,
  'Limited',
  true
),
(
  'phantom-sneakers',
  'Phantom Sneakers',
  'Italian-crafted black leather sneakers with a cushioned sole and minimalist design. The ultimate everyday luxury footwear.',
  320.00,
  (SELECT id FROM categories WHERE slug = 'men'),
  '["https://images.pexels.com/photos/12745055/pexels-photo-12745055.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  52,
  'MNX-SN-003',
  4.7,
  532,
  'Trending',
  true
),
(
  'midnight-leather-bag',
  'Midnight Leather Bag',
  'Full-grain black leather messenger bag with a padded laptop compartment and antique brass fittings. Handmade in Florence.',
  1450.00,
  (SELECT id FROM categories WHERE slug = 'men'),
  '["https://images.pexels.com/photos/12373441/pexels-photo-12373441.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  18,
  'MNX-LB-004',
  4.9,
  178,
  null,
  true
),
(
  'shadow-sunglasses',
  'Shadow Sunglasses',
  'Matte black acetate frames with polarized gradient lenses and gold-tone accents. UV400 protection in a timeless silhouette.',
  289.00,
  (SELECT id FROM categories WHERE slug = 'men'),
  '["https://images.pexels.com/photos/34467082/pexels-photo-34467082.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  67,
  'MNX-SG-005',
  4.6,
  342,
  null,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  sku = EXCLUDED.sku,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  tag = EXCLUDED.tag,
  is_featured = EXCLUDED.is_featured;

-- WOMEN (5)
INSERT INTO products (slug, name, description, price, category_id, images, stock, sku, rating, review_count, tag, is_featured) VALUES
(
  'noir-silk-dress',
  'Noir Silk Dress',
  'A floor-length black silk gown with a cowl neckline and open back. Cut on the bias for a fluid, sculptural drape.',
  2200.00,
  (SELECT id FROM categories WHERE slug = 'women'),
  '["https://images.pexels.com/photos/19919584/pexels-photo-19919584.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  14,
  'WNS-SD-001',
  5.0,
  167,
  'New',
  true
),
(
  'eclipse-handbag',
  'Eclipse Handbag',
  'Structured black calfskin handbag with a gold chain strap and quilted detailing. Includes a detachable pouch and dust bag.',
  1680.00,
  (SELECT id FROM categories WHERE slug = 'women'),
  '["https://images.pexels.com/photos/10365596/pexels-photo-10365596.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  22,
  'WNS-HB-002',
  4.8,
  289,
  'Trending',
  true
),
(
  'velvet-stiletto-heels',
  'Velvet Stiletto Heels',
  'Black velvet stiletto pumps with a 100mm heel and a pointed toe. Lined in leather for all-evening comfort.',
  690.00,
  (SELECT id FROM categories WHERE slug = 'women'),
  '["https://images.pexels.com/photos/12877059/pexels-photo-12877059.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  35,
  'WNS-SH-003',
  4.7,
  198,
  null,
  true
),
(
  'obsidian-watch',
  'Obsidian Watch',
  'A slim unisex watch with a black dial, rose gold hands, and a mesh steel bracelet. Sapphire glass, 3 ATM water resistance.',
  890.00,
  (SELECT id FROM categories WHERE slug = 'women'),
  '["https://images.pexels.com/photos/19810831/pexels-photo-19810831.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  29,
  'WNS-WT-004',
  4.9,
  134,
  null,
  true
),
(
  'midnight-trench-coat',
  'Midnight Trench Coat',
  'A double-breasted black wool trench with a belted waist and storm flap. Timeless tailoring for the modern wardrobe.',
  1750.00,
  (SELECT id FROM categories WHERE slug = 'women'),
  '["https://images.pexels.com/photos/15035248/pexels-photo-15035248.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  16,
  'WNS-TC-005',
  4.8,
  112,
  'Bestseller',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  sku = EXCLUDED.sku,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  tag = EXCLUDED.tag,
  is_featured = EXCLUDED.is_featured;

-- PERFUME (1)
INSERT INTO products (slug, name, description, price, category_id, images, stock, sku, rating, review_count, tag, is_featured) VALUES
(
  'coco-noir-parfum',
  'Coco Noir Parfum',
  'An opulent black fragrance with top notes of bergamot and grapefruit, a heart of rose and jasmine, and a base of sandalwood and vanilla. 100ml eau de parfum.',
  175.00,
  (SELECT id FROM categories WHERE slug = 'perfume'),
  '["https://images.pexels.com/photos/21926650/pexels-photo-21926650.jpeg?auto=compress&cs=tinysrgb&h=1200&w=800"]',
  120,
  'PRF-CN-001',
  4.9,
  421,
  'Bestseller',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  images = EXCLUDED.images,
  stock = EXCLUDED.stock,
  sku = EXCLUDED.sku,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  tag = EXCLUDED.tag,
  is_featured = EXCLUDED.is_featured;

-- Seed a coupon
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, is_active) VALUES
  ('ONYX10', '10% off your first order', 'percentage', 10.00, 0, true),
  ('LUXURY50', '$50 off orders over $500', 'fixed', 50.00, 500, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  min_order_amount = EXCLUDED.min_order_amount,
  is_active = EXCLUDED.is_active;
