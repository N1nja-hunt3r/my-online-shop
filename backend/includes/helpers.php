<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

function getJsonInput() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function jsonResponse($data) {
    echo json_encode($data);
    exit;
}

function errorResponse($msg, $code = 400) {
    http_response_code($code);
    jsonResponse(['error' => $msg]);
}

require_once __DIR__ . '/../config/db.php';
