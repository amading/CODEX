<?php
declare(strict_types=1);

require dirname(__DIR__) . '/includes/cors.php';

try {
    $pdo = require dirname(__DIR__) . '/includes/db.php';
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'GET only']);
    exit;
}

$official = $pdo->query('SELECT * FROM vw_bir_receipt_totals')->fetch(PDO::FETCH_ASSOC);
$purchase = $pdo->query('SELECT * FROM vw_bir_purchase_totals')->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    'ok' => true,
    'officialReceipts' => $official ?: [],
    'purchases' => $purchase ?: [],
]);
