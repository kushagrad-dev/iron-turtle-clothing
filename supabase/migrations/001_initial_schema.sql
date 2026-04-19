-- =============================================
-- Iron Turtle E-Commerce — Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role full access" ON profiles FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- 2. CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Only admins can modify categories" ON categories FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- 3. PRODUCTS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{S,M,L,XL,XXL}',
  colors TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX idx_products_slug ON products(slug);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Only service role can modify products" ON products FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- 4. CART ITEMS
-- =============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, color)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 5. ORDERS
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role full access orders" ON orders FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- 6. WISHLIST
-- =============================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 7. REVIEWS
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Function to update product rating after review changes
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET
    rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)), 0),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = COALESCE(NEW.product_id, OLD.product_id))
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- =============================================
-- SEED DATA — Categories
-- =============================================
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Men', 'men', 'Performance wear engineered for the modern man', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600'),
  ('Women', 'women', 'Bold activewear designed for strength and style', 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600'),
  ('Gym', 'gym', 'Train harder in our high-performance gym collection', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'),
  ('Streetwear', 'streetwear', 'Street-ready looks that go from gym to city', 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED DATA — Products
-- =============================================
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, images, sizes, colors, stock, featured) VALUES
  ('Titan Compression Tee', 'titan-compression-tee', 'Engineered with 4-way stretch fabric for unrestricted movement. Moisture-wicking technology keeps you dry through the most intense workouts.', 2499, 4999, (SELECT id FROM categories WHERE slug = 'men'), ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'], ARRAY['S','M','L','XL','XXL'], ARRAY['Black','Navy','Charcoal'], 150, true),
  ('Apex Training Hoodie', 'apex-training-hoodie', 'Premium heavyweight cotton-blend hoodie with ergonomic hood design. Features kangaroo pocket and ribbed cuffs.', 4999, 7999, (SELECT id FROM categories WHERE slug = 'men'), ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600','https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600'], ARRAY['S','M','L','XL','XXL'], ARRAY['Black','Storm Grey','Forest Green'], 100, true),
  ('Iron Shell Joggers', 'iron-shell-joggers', 'Tapered fit joggers with reinforced knee panels. Zippered pockets keep your essentials secure during training.', 3999, 5999, (SELECT id FROM categories WHERE slug = 'men'), ARRAY['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600'], ARRAY['S','M','L','XL','XXL'], ARRAY['Black','Dark Grey','Navy'], 120, true),
  ('Valkyrie Sports Bra', 'valkyrie-sports-bra', 'High-impact support with breathable mesh panels. Designed for maximum comfort during dynamic movements.', 1999, 3499, (SELECT id FROM categories WHERE slug = 'women'), ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'], ARRAY['XS','S','M','L','XL'], ARRAY['Black','Blush','Electric Blue'], 200, true),
  ('Phoenix Crop Top', 'phoenix-crop-top', 'Lightweight cropped tank with flatlock seams for zero-chafe performance. Perfect for HIIT and yoga.', 1799, 2999, (SELECT id FROM categories WHERE slug = 'women'), ARRAY['https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600'], ARRAY['XS','S','M','L','XL'], ARRAY['Black','White','Neon Green'], 180, false),
  ('Spartan Leggings', 'spartan-leggings', 'Squat-proof high-waist leggings with side pocket. Compression fabric sculpts and supports through every rep.', 3499, 4999, (SELECT id FROM categories WHERE slug = 'women'), ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'], ARRAY['XS','S','M','L','XL'], ARRAY['Black','Charcoal','Deep Purple'], 160, true),
  ('Beast Mode Tank', 'beast-mode-tank', 'Dropped armhole tank with raw edge details. Ultra-soft fabric with aggressive gym aesthetic.', 1499, 2499, (SELECT id FROM categories WHERE slug = 'gym'), ARRAY['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600'], ARRAY['S','M','L','XL','XXL'], ARRAY['Black','Military Green','Blood Red'], 200, false),
  ('Deadlift Shorts', 'deadlift-shorts', '7-inch inseam training shorts with built-in compression liner. Reinforced gusset for full range of motion.', 2999, 4499, (SELECT id FROM categories WHERE slug = 'gym'), ARRAY['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600'], ARRAY['S','M','L','XL','XXL'], ARRAY['Black','Grey','Navy'], 140, true),
  ('Urban Camo Jacket', 'urban-camo-jacket', 'Water-resistant windbreaker with reflective accents. Transitions seamlessly from gym to street.', 7999, 12999, (SELECT id FROM categories WHERE slug = 'streetwear'), ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'], ARRAY['S','M','L','XL','XXL'], ARRAY['Black Camo','Urban Grey'], 80, true),
  ('Street Flex Cargo', 'street-flex-cargo', 'Modern cargo pants with stretch fabric and utility pockets. Designed for athletes who live beyond the gym.', 4999, 7499, (SELECT id FROM categories WHERE slug = 'streetwear'), ARRAY['https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600'], ARRAY['S','M','L','XL','XXL'], ARRAY['Black','Olive','Sand'], 100, false),
  ('Turtle Shell Backpack', 'turtle-shell-backpack', 'Hard-shell athletic backpack with shoe compartment. Waterproof zippers and padded laptop sleeve.', 5999, 8999, (SELECT id FROM categories WHERE slug = 'streetwear'), ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'], ARRAY['One Size'], ARRAY['Black','Military Green'], 60, true),
  ('Grind Stringer', 'grind-stringer', 'Competition-style stringer with deep cuts for maximum ventilation. Lightweight and breathable.', 1299, 1999, (SELECT id FROM categories WHERE slug = 'gym'), ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'], ARRAY['S','M','L','XL'], ARRAY['Black','White','Gold'], 220, false)
ON CONFLICT (slug) DO NOTHING;
