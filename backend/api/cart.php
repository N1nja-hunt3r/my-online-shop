<?php
require_once __DIR__ . '/../includes/helpers.php';

$conn   = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$data   = getJsonInput();

if ($method === 'GET') {
    $userId = $_GET['user_id'] ?? 0;
    if (!$userId) errorResponse('User ID required');

    $result = $conn->prepare("SELECT c.id, c.quantity, p.id as product_id, p.name, p.brand, p.price, p.discount, p.image, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?");
    $result->bind_param('i', $userId);
    $result->execute();
    $items = $result->get_result()->fetch_all(MYSQLI_ASSOC);
    jsonResponse(['success' => true, 'cart' => $items]);
}

$userId    = $data['user_id']    ?? 0;
$productId = $data['product_id'] ?? 0;
$quantity  = $data['quantity']   ?? 1;

if ($method === 'POST') {
    if (!$userId || !$productId) errorResponse('User ID and Product ID required');
    $stmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?");
    $stmt->bind_param('iiii', $userId, $productId, $quantity, $quantity);
    $stmt->execute() ? jsonResponse(['success' => true, 'message' => 'Added to cart!']) : errorResponse('Could not add to cart');
}

if ($method === 'PUT') {
    if ($quantity < 1) errorResponse('Quantity must be at least 1');
    $stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
    $stmt->bind_param('iii', $quantity, $userId, $productId);
    $stmt->execute() ? jsonResponse(['success' => true, 'message' => 'Cart updated!']) : errorResponse('Could not update cart');
}

if ($method === 'DELETE') {
    $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->bind_param('ii', $userId, $productId);
    $stmt->execute() ? jsonResponse(['success' => true, 'message' => 'Item removed from cart!']) : errorResponse('Could not remove item');
}
