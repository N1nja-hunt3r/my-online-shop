<?php
require_once __DIR__ . '/../includes/helpers.php';

$conn   = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// GET /api/wishlist.php?user_id=N — Fetch wishlist items
if ($method === 'GET') {
    $userId = (int)($_GET['user_id'] ?? 0);
    if (!$userId) errorResponse('User ID required');

    $result = $conn->prepare("SELECT product_id, product_data FROM wishlist WHERE user_id = ?");
    $result->bind_param('i', $userId);
    $result->execute();
    $rows = $result->get_result()->fetch_all(MYSQLI_ASSOC);

    $items = [];
    foreach ($rows as $row) {
        $pd = json_decode($row['product_data'], true) ?: [];
        $items[] = array_merge($pd, ['id' => (int)$row['product_id']]);
    }

    jsonResponse(['success' => true, 'wishlist' => $items]);
}

$data = getJsonInput();
$userId      = (int)($data['user_id']      ?? 0);
$productId   = (int)($data['product_id']   ?? 0);
$productData = $data['product_data'] ?? null;

// POST /api/wishlist.php — Toggle item (add if not exists, remove if exists)
if ($method === 'POST') {
    if (!$userId || !$productId) errorResponse('User ID and Product ID required');
    if (!$productData) errorResponse('Product data required');

    // Check if already exists
    $check = $conn->prepare("SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?");
    $check->bind_param('ii', $userId, $productId);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        // Remove (toggle off)
        $del = $conn->prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?");
        $del->bind_param('ii', $userId, $productId);
        $del->execute();
        $check->close();
        jsonResponse(['success' => true, 'message' => 'Removed from wishlist!', 'inWishlist' => false]);
    }

    $check->close();

    // Add
    $productJson = json_encode($productData);
    $stmt = $conn->prepare("INSERT INTO wishlist (user_id, product_id, product_data) VALUES (?, ?, ?)");
    $stmt->bind_param('iis', $userId, $productId, $productJson);
    $stmt->execute() ? jsonResponse(['success' => true, 'message' => 'Added to wishlist!', 'inWishlist' => true]) : errorResponse('Could not add to wishlist');
}

// DELETE /api/wishlist.php — Remove item
if ($method === 'DELETE') {
    $input = getJsonInput();
    $uid = (int)($input['user_id']    ?? ($_GET['user_id']    ?? 0));
    $pid = (int)($input['product_id'] ?? ($_GET['product_id'] ?? 0));
    if (!$uid || !$pid) errorResponse('User ID and Product ID required');

    $stmt = $conn->prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?");
    $stmt->bind_param('ii', $uid, $pid);
    $stmt->execute() ? jsonResponse(['success' => true, 'message' => 'Item removed from wishlist!']) : errorResponse('Could not remove item');
}
