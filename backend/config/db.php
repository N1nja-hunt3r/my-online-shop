<?php
// =============================================
// Database Connection Configuration
// =============================================

define('DB_HOST', 'localhost');
define('DB_USER', 'root');       // Change to your MySQL username
define('DB_PASS', 'N1nja_Hunt3r');
define('DB_NAME', 'shopease');

/**
 * Creates and returns a MySQLi database connection.
 * Call this function in every API file that needs DB access.
 */
function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Check if connection failed
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
        exit;
    }

    // Set character encoding to UTF-8
    $conn->set_charset('utf8mb4');

    return $conn;
}
