<?php
require_once __DIR__ . '/../includes/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') errorResponse('Method not allowed', 405);

$conn = getConnection();
$where  = [];
$params = [];
$types  = '';

if (!empty($_GET['category']))    { $where[] = 'category = ?';    $params[] = $_GET['category'];    $types .= 's'; }
if (!empty($_GET['subcategory'])) { $where[] = 'subcategory = ?'; $params[] = $_GET['subcategory']; $types .= 's'; }
if (!empty($_GET['brand']))       { $where[] = 'brand = ?';       $params[] = $_GET['brand'];       $types .= 's'; }
if (!empty($_GET['max_price']))   { $where[] = 'price <= ?';      $params[] = (float)$_GET['max_price']; $types .= 'd'; }
if (!empty($_GET['min_rating']))  { $where[] = 'rating >= ?';     $params[] = (float)$_GET['min_rating']; $types .= 'd'; }

if (!empty($_GET['search'])) {
    $term = '%' . $_GET['search'] . '%';
    $where[] = '(name LIKE ? OR brand LIKE ?)';
    $params[] = $term; $params[] = $term;
    $types .= 'ss';
}

if (!empty($_GET['id'])) {
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param('i', $_GET['id']);
    $stmt->execute();
    $product = $stmt->get_result()->fetch_assoc();
    $product ? jsonResponse(['success' => true, 'product' => $product]) : errorResponse('Product not found', 404);
}

$sql = "SELECT * FROM products";
if (!empty($where)) $sql .= " WHERE " . implode(' AND ', $where);

$sort = $_GET['sort'] ?? 'default';
$sql .= match($sort) { 'low_to_high' => " ORDER BY price ASC", 'high_to_low' => " ORDER BY price DESC", 'rating' => " ORDER BY rating DESC", default => " ORDER BY id DESC" };

if (!empty($_GET['limit'])) $sql .= " LIMIT " . (int)$_GET['limit'];

$stmt = $conn->prepare($sql);
if (!empty($params)) $stmt->bind_param($types, ...$params);
$stmt->execute();

$products = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
jsonResponse(['success' => true, 'products' => $products, 'count' => count($products)]);
