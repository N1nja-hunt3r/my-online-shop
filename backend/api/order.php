<?php
require_once __DIR__ . '/../includes/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') errorResponse('Method not allowed', 405);

$data = getJsonInput();
$userId = (int)($data['user_id'] ?? 0);
$address = trim($data['address'] ?? '');

if (!$userId) errorResponse('User ID required');
if (!$address) errorResponse('Delivery address required');

$conn = getConnection();

// Fetch cart items
$result = $conn->prepare("SELECT product_id, quantity, product_data FROM cart WHERE user_id = ?");
$result->bind_param('i', $userId);
$result->execute();
$cartRows = $result->get_result()->fetch_all(MYSQLI_ASSOC);

if (empty($cartRows)) errorResponse('Cart is empty');

// Calculate totals
$subtotal = 0;
$items = [];
foreach ($cartRows as $row) {
    $pd = json_decode($row['product_data'], true) ?: [];
    $price = (float)($pd['price'] ?? 0);
    $discount = (int)($pd['discount'] ?? 0);
    $qty = (int)$row['quantity'];
    $discountedPrice = $price - ($price * $discount / 100);
    $lineTotal = $discountedPrice * $qty;
    $subtotal += $lineTotal;

    $items[] = [
        'product_id' => (int)$row['product_id'],
        'quantity' => $qty,
        'price' => $discountedPrice,
        'product_data' => $pd,
    ];
}

$gst = round($subtotal * 0.18, 2);
$deliveryCharge = $subtotal >= 500 ? 0 : 49;
$totalAmount = round($subtotal + $gst + $deliveryCharge, 2);

// Create order
$conn->begin_transaction();
try {
    $stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, gst, delivery_charge, status, address) VALUES (?, ?, ?, ?, 'confirmed', ?)");
    $stmt->bind_param('iddds', $userId, $totalAmount, $gst, $deliveryCharge, $address);
    $stmt->execute();
    $orderId = $conn->insert_id;

    // Insert order items with product_data
    $itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price, product_data) VALUES (?, ?, ?, ?, ?)");
    foreach ($items as $item) {
        $pdJson = json_encode($item['product_data']);
        $itemStmt->bind_param('iiids', $orderId, $item['product_id'], $item['quantity'], $item['price'], $pdJson);
        $itemStmt->execute();
    }
    $itemStmt->close();

    // Clear cart
    $clear = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
    $clear->bind_param('i', $userId);
    $clear->execute();
    $clear->close();

    $conn->commit();

    jsonResponse([
        'success' => true,
        'message' => 'Order placed successfully!',
        'order' => [
            'id' => $orderId,
            'total_amount' => $totalAmount,
            'gst' => $gst,
            'delivery_charge' => $deliveryCharge,
            'subtotal' => $subtotal,
            'status' => 'confirmed',
            'address' => $address,
            'items' => $items,
        ]
    ]);
} catch (Exception $e) {
    $conn->rollback();
    errorResponse('Failed to create order: ' . $e->getMessage(), 500);
}
