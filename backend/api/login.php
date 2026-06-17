<?php
require_once __DIR__ . '/../includes/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') errorResponse('Method not allowed', 405);

$data = getJsonInput();
$email    = trim($data['email']    ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) errorResponse('Email and password are required');

$conn = getConnection();
$stmt = $conn->prepare("SELECT id, name, email, password, phone FROM users WHERE email = ?");
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) errorResponse('Invalid email or password');

$user = $result->fetch_assoc();
if (!password_verify($password, $user['password'])) errorResponse('Invalid email or password');

jsonResponse([
    'success' => true, 'message' => 'Login successful!',
    'user' => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'phone' => $user['phone']]
]);
