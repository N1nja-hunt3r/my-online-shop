<?php
require_once __DIR__ . '/../includes/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') errorResponse('Method not allowed', 405);

$data = getJsonInput();
$name  = trim($data['name']  ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$phone = trim($data['phone'] ?? '');

if (!$name || !$email || !$password) errorResponse('Name, email, and password are required');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) errorResponse('Invalid email address');
if (strlen($password) < 6) errorResponse('Password must be at least 6 characters');

$conn = getConnection();

$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param('s', $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) errorResponse('Email already registered');
$check->close();

$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)");
$stmt->bind_param('ssss', $name, $email, $hashed, $phone);

if ($stmt->execute()) {
    jsonResponse(['success' => true, 'message' => 'Account created successfully!', 'user' => ['id' => $conn->insert_id, 'name' => $name, 'email' => $email]]);
}
errorResponse('Registration failed', 500);
