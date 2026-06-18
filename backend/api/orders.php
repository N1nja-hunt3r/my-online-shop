<?php
require_once __DIR__ . '/../includes/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') errorResponse('Method not allowed', 405);

$userId = (int)($_GET['user_id'] ?? 0);
if (!$userId) errorResponse('User ID required');

$conn = getConnection();

// Fetch orders
$ordersResult = $conn->prepare("SELECT id, total_amount, gst, delivery_charge, status, address, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC");
$ordersResult->bind_param('i', $userId);
$ordersResult->execute();
$orders = $ordersResult->get_result()->fetch_all(MYSQLI_ASSOC);

// Fetch items for each order
$itemsStmt = $conn->prepare("SELECT product_id, quantity, price, product_data FROM order_items WHERE order_id = ?");
foreach ($orders as &$order) {
    $itemsStmt->bind_param('i', $order['id']);
    $itemsStmt->execute();
    $rows = $itemsStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $order['items'] = [];
    foreach ($rows as $row) {
        $pd = json_decode($row['product_data'], true) ?: [];
        $order['items'][] = array_merge($pd, [
            'product_id' => (int)$row['product_id'],
            'quantity'   => (int)$row['quantity'],
            'price'      => (float)$row['price'],
        ]);
    }
}
unset($order);
$itemsStmt->close();

jsonResponse(['success' => true, 'orders' => $orders]);
