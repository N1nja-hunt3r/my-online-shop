-- =============================================
-- Migration: Add product_data to cart + create wishlist
-- =============================================
-- NOTE: FK constraint name is auto-generated;
-- run the PHP migration endpoint instead (backend/api/migrate.php)
-- or manually drop the FK if this fails.
-- =============================================

USE shopease;

-- Add product_data column to cart (safe to re-run)
ALTER TABLE cart ADD COLUMN IF NOT EXISTS product_data JSON AFTER quantity;

-- Drop old wishlist table (wrong FK) and recreate correctly
DROP TABLE IF EXISTS wishlist;
CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  product_data JSON,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist_item (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
