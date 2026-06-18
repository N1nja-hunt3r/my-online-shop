<?php
require_once __DIR__ . '/../includes/helpers.php';

$conn   = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// GET /api/cart.php?user_id=N — Fetch cart items
if ($method === 'GET') {
    $userId = (int)($_GET['user_id'] ?? 0);
    if (!$userId) errorResponse('User ID required');

    $result = $conn->prepare("SELECT product_id, quantity, product_data FROM cart WHERE user_id = ?");
    $result->bind_param('i', $userId);
    $result->execute();
    $rows = $result->get_result()->fetch_all(MYSQLI_ASSOC);

    $items = [];
    foreach ($rows as $row) {
        $pd = json_decode($row['product_data'], true) ?: [];
        $items[] = array_merge($pd, [
            'id'    => (int)$row['product_id'],
            'qty'   => (int)$row['quantity'],
        ]);
    }

    jsonResponse(['success' => true, 'cart' => $items]);
}

$data = getJsonInput();
$userId      = (int)($data['user_id']      ?? 0);
$productId   = (int)($data['product_id']   ?? 0);
$quantity    = (int)($data['quantity']     ?? 1);
$productData = $data['product_data'] ?? null;

// POST /api/cart.php — Add item
if ($method === 'POST') {
    if (!$userId || !$productId) errorResponse('User ID and Product ID required');
    if (!$productData) errorResponse('Product data required');

    $productJson = json_encode($productData);

    $stmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity, product_data) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?, product_data = ?");
    $stmt->bind_param('iiisss', $userId, $productId, $quantity, $productJson, $quantity, $productJson);
    $stmt->execute() ? jsonResponse(['success' => true, 'message' => 'Added to cart!']) : errorResponse('Could not add to cart');
}

// PUT /api/cart.php — Update quantity
if ($method === 'PUT') {
    if (!$userId || !$productId) errorResponse('User ID and Product ID required');
    if ($quantity < 1) errorResponse('Quantity must be at least 1');

    $stmt = $conn->prepare("UPDATE cart SET quantity = ?, product_data = ? WHERE user_id = ? AND product_id = ?");
    $productJson = json_encode($productData ?: new stdClass);
    $stmt->bind_param('isii', $quantity, $productJson, $userId, $productId);
    $stmt->execute() ? jsonResponse(['success' => true, 'message' => 'Cart updated!']) : errorResponse('Could not update cart');
}

// DELETE /api/cart.php — Remove item
if ($method === 'DELETE') {
    $input = getJsonInput();
    $uid = (int)($input['user_id']    ?? ($_GET['user_id']    ?? 0));
    $pid = (int)($input['product_id'] ?? ($_GET['product_id'] ?? 0));
    if (!$uid || !$pid) errorResponse('User ID and Product ID required');

    $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->bind_param('ii', $uid, $pid);
    $stmt->execute() ? jsonResponse(['success' => true, 'message' => 'Item removed from cart!']) : errorResponse('Could not remove item');
}
