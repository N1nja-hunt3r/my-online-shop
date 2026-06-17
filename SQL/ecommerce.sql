-- =============================================
-- ShopEase E-Commerce Database Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS shopease;
USE shopease;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,        -- hashed with password_hash()
  phone VARCHAR(15),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100),
  category VARCHAR(100),                 -- laptops, mobiles, refrigerators, etc.
  subcategory VARCHAR(100),              -- gaming, budget, split, etc.
  price DECIMAL(10,2) NOT NULL,
  discount INT DEFAULT 0,               -- discount percentage
  rating DECIMAL(3,1) DEFAULT 0,
  description TEXT,
  specifications JSON,                   -- flexible specs as JSON
  image VARCHAR(255),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  gst DECIMAL(10,2) DEFAULT 0,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  status ENUM('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
  coupon_code VARCHAR(50),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =============================================
-- CART TABLE
-- =============================================
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- =============================================
-- WISHLIST TABLE
-- =============================================
CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist_item (user_id, product_id)
);

-- =============================================
-- MESSAGES TABLE (Contact Form)
-- =============================================
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- NEWSLETTER TABLE
-- =============================================
CREATE TABLE newsletter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SAMPLE DATA - PRODUCTS
-- =============================================

INSERT INTO products (name, brand, category, subcategory, price, discount, rating, description, specifications, image, stock) VALUES

-- LAPTOPS
('Dell Inspiron 15', 'Dell', 'laptops', 'student', 45999, 15, 4.2,
 'Perfect laptop for students with long battery life and reliable performance.',
 '{"Processor":"Intel Core i5-12th Gen","RAM":"8GB DDR4","Storage":"512GB SSD","Display":"15.6 inch FHD","OS":"Windows 11","Battery":"3-cell 41WHr"}',
 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 50),

('ASUS ROG Strix G15', 'ASUS', 'laptops', 'gaming', 89999, 10, 4.6,
 'High-performance gaming laptop with NVIDIA RTX graphics.',
 '{"Processor":"AMD Ryzen 9 7945HX","RAM":"16GB DDR5","Storage":"1TB SSD","GPU":"NVIDIA RTX 4070","Display":"15.6 inch 165Hz","OS":"Windows 11"}',
 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', 30),

('HP EliteBook 840', 'HP', 'laptops', 'business', 72999, 12, 4.4,
 'Premium business laptop with enterprise security features.',
 '{"Processor":"Intel Core i7-12th Gen","RAM":"16GB DDR5","Storage":"512GB SSD","Display":"14 inch FHD IPS","OS":"Windows 11 Pro","Battery":"6-cell 53WHr"}',
 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', 25),

('Lenovo IdeaPad 3', 'Lenovo', 'laptops', 'student', 35999, 20, 4.0,
 'Budget-friendly laptop ideal for everyday tasks and online classes.',
 '{"Processor":"AMD Ryzen 5 5500U","RAM":"8GB DDR4","Storage":"256GB SSD","Display":"15.6 inch HD","OS":"Windows 11","Battery":"2-cell 35WHr"}',
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', 60),

('MSI Titan GT77', 'MSI', 'laptops', 'gaming', 1,20999, 8, 4.7,
 'Ultimate gaming beast with 4K display and top-tier specs.',
 '{"Processor":"Intel Core i9-13th Gen","RAM":"32GB DDR5","Storage":"2TB NVMe","GPU":"NVIDIA RTX 4090","Display":"17.3 inch 4K 144Hz","OS":"Windows 11"}',
 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', 15),

-- MOBILES
('Samsung Galaxy S24', 'Samsung', 'mobiles', 'android', 74999, 5, 4.5,
 'Flagship Android smartphone with AI-powered camera system.',
 '{"Processor":"Exynos 2400","RAM":"8GB","Storage":"256GB","Display":"6.2 inch Dynamic AMOLED","Camera":"50MP+12MP+10MP","Battery":"4000mAh"}',
 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 100),

('Apple iPhone 15', 'Apple', 'mobiles', 'iphone', 79999, 3, 4.7,
 'The latest iPhone with USB-C and titanium design.',
 '{"Chip":"A16 Bionic","RAM":"6GB","Storage":"128GB","Display":"6.1 inch Super Retina XDR","Camera":"48MP+12MP","Battery":"3877mAh"}',
 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 80),

('Redmi Note 13', 'Xiaomi', 'mobiles', 'budget', 17999, 18, 4.2,
 'Best value for money smartphone with 200MP camera.',
 '{"Processor":"Snapdragon 7s Gen 2","RAM":"8GB","Storage":"256GB","Display":"6.67 inch AMOLED","Camera":"200MP+8MP+2MP","Battery":"5000mAh"}',
 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 150),

('OnePlus 12', 'OnePlus', 'mobiles', 'android', 64999, 8, 4.6,
 'Flagship killer with Hasselblad camera and 100W fast charging.',
 '{"Processor":"Snapdragon 8 Gen 3","RAM":"12GB","Storage":"256GB","Display":"6.82 inch LTPO AMOLED","Camera":"50MP+64MP+48MP","Battery":"5400mAh"}',
 'https://images.unsplash.com/photo-1533228100845-08145b01de14?w=400', 70),

('Realme Narzo 60', 'Realme', 'mobiles', 'budget', 14999, 25, 3.9,
 'Great budget phone with smooth 120Hz display.',
 '{"Processor":"MediaTek Dimensity 6020","RAM":"6GB","Storage":"128GB","Display":"6.43 inch AMOLED 120Hz","Camera":"64MP+2MP","Battery":"5000mAh"}',
 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 200),

-- REFRIGERATORS
('LG 260L Single Door', 'LG', 'refrigerators', 'single-door', 22999, 15, 4.3,
 'Energy-efficient single door refrigerator with smart inverter compressor.',
 '{"Capacity":"260 Litres","Star Rating":"3 Star","Compressor":"Smart Inverter","Color":"Shiny Steel","Defrost":"Direct Cool","Warranty":"10 year compressor"}',
 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400', 30),

('Samsung 345L Double Door', 'Samsung', 'refrigerators', 'double-door', 35999, 12, 4.5,
 'Frost-free double door fridge with digital inverter technology.',
 '{"Capacity":"345 Litres","Star Rating":"3 Star","Compressor":"Digital Inverter","Color":"Elegant Inox","Defrost":"Frost Free","Warranty":"10 year compressor"}',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 25),

('Whirlpool 630L Side by Side', 'Whirlpool', 'refrigerators', 'side-by-side', 72999, 10, 4.4,
 'Premium side-by-side with in-door water dispenser and ice maker.',
 '{"Capacity":"630 Litres","Star Rating":"2 Star","Compressor":"6th Sense Technology","Color":"German Steel","Defrost":"Frost Free","Warranty":"1 year comprehensive"}',
 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400', 15),

-- WASHING MACHINES
('LG 7kg Top Load', 'LG', 'washing-machines', 'top-load', 18999, 20, 4.2,
 'Fully automatic top load with smart motion technology.',
 '{"Capacity":"7 kg","Type":"Top Load","Star Rating":"5 Star","Motor":"Smart Inverter","Programs":"10","Warranty":"2 years"}',
 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400', 40),

('Samsung 8kg Front Load', 'Samsung', 'washing-machines', 'front-load', 34999, 15, 4.5,
 'AI-powered front load washing machine with EcoBubble technology.',
 '{"Capacity":"8 kg","Type":"Front Load","Star Rating":"5 Star","Motor":"Digital Inverter","Programs":"15","Warranty":"3 years"}',
 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', 30),

('Whirlpool 7.5kg Semi Auto', 'Whirlpool', 'washing-machines', 'semi-automatic', 12999, 25, 3.8,
 'Semi-automatic washing machine with turbo scrub technology.',
 '{"Capacity":"7.5 kg","Type":"Semi-Automatic","Star Rating":"3 Star","Motor":"Stain Wash","Programs":"3","Warranty":"2 years"}',
 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400', 50),

-- AIR CONDITIONERS
('Daikin 1.5 Ton Split AC', 'Daikin', 'air-conditioners', 'split', 38999, 12, 4.6,
 'Energy-saving split AC with coanda airflow for even cooling.',
 '{"Capacity":"1.5 Ton","Type":"Split AC","Star Rating":"5 Star","Compressor":"Inverter","Refrigerant":"R32","Warranty":"1 year comprehensive"}',
 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400', 35),

('Voltas 1 Ton Window AC', 'Voltas', 'air-conditioners', 'window', 25999, 18, 4.0,
 'Reliable window AC with 4-in-1 adjustable cooling modes.',
 '{"Capacity":"1 Ton","Type":"Window AC","Star Rating":"5 Star","Compressor":"Fixed Speed","Refrigerant":"R22","Warranty":"1 year comprehensive"}',
 'https://images.unsplash.com/photo-1631693671069-5b98a4a82d38?w=400', 40),

('LG 2 Ton Inverter Split AC', 'LG', 'air-conditioners', 'inverter', 52999, 10, 4.7,
 'Dual inverter compressor AC with auto-clean feature.',
 '{"Capacity":"2 Ton","Type":"Split Inverter","Star Rating":"5 Star","Compressor":"Dual Inverter","Refrigerant":"R32","Warranty":"10 year compressor"}',
 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400', 20);
