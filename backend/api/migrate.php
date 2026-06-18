<?php
require_once __DIR__ . '/../includes/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') errorResponse('Method not allowed', 405);

$conn = getConnection();

$steps = [];

// 1. Drop FK constraint on product_id in cart table
$fk = $conn->query("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '" . DB_NAME . "' AND TABLE_NAME = 'cart' AND COLUMN_NAME = 'product_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1");
if ($fk && $row = $fk->fetch_assoc()) {
    $conn->query("ALTER TABLE cart DROP FOREIGN KEY `{$row['CONSTRAINT_NAME']}`");
    $steps[] = 'Dropped FK constraint on cart.product_id';
}

// 2. Add product_data column to cart
$col = $conn->query("SHOW COLUMNS FROM cart LIKE 'product_data'");
if ($col && $col->num_rows === 0) {
    $conn->query("ALTER TABLE cart ADD COLUMN product_data JSON AFTER quantity");
    $steps[] = 'Added product_data column to cart';
}

// 3. Recreate wishlist table (drop old one with broken FK on products)
$conn->query("DROP TABLE IF EXISTS wishlist");
$conn->query("
    CREATE TABLE wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        product_data JSON,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_wishlist_item (user_id, product_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
");
$steps[] = 'Created wishlist table (with product_data, no products FK)';

// 4. Add product_data to order_items and drop FK on products
$fk2 = $conn->query("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = '" . DB_NAME . "' AND TABLE_NAME = 'order_items' AND COLUMN_NAME = 'product_id' AND REFERENCED_TABLE_NAME IS NOT NULL LIMIT 1");
if ($fk2 && $row2 = $fk2->fetch_assoc()) {
    $conn->query("ALTER TABLE order_items DROP FOREIGN KEY `{$row2['CONSTRAINT_NAME']}`");
    $steps[] = 'Dropped FK constraint on order_items.product_id';
}

$col2 = $conn->query("SHOW COLUMNS FROM order_items LIKE 'product_data'");
if ($col2 && $col2->num_rows === 0) {
    $conn->query("ALTER TABLE order_items ADD COLUMN product_data JSON AFTER price");
    $steps[] = 'Added product_data column to order_items';
}

jsonResponse(['success' => true, 'message' => 'Migration completed', 'steps' => $steps]);
