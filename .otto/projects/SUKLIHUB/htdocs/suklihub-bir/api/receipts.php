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

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $stmt = $pdo->query(
        'SELECT id, external_id AS externalId, sort_order AS sortOrder, customer_name AS customer, or_number AS orNo,
                line_date AS date, order_ref AS orderRef, cashier, amount, vat, remarks
         FROM bir_official_receipt ORDER BY sort_order ASC, id ASC'
    );
    echo json_encode(['ok' => true, 'rows' => $stmt->fetchAll()]);
    exit;
}

if ($method === 'POST' || $method === 'PUT') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw ?: 'null', true);
    if (!is_array($body) || !isset($body['rows']) || !is_array($body['rows'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Expected JSON { "rows": [ ... ] }']);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $pdo->exec('DELETE FROM bir_official_receipt');
        $ins = $pdo->prepare(
            'INSERT INTO bir_official_receipt
                (external_id, sort_order, customer_name, or_number, line_date, order_ref, cashier, amount, vat, remarks)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        foreach (array_values($body['rows']) as $idx => $r) {
            if (!is_array($r)) {
                continue;
            }
            $ext = isset($r['externalId']) ? (string) $r['externalId'] : (isset($r['id']) ? (string) $r['id'] : null);
            if ($ext === '') {
                $ext = null;
            }
            $sort = isset($r['sortOrder']) ? (int) $r['sortOrder'] : $idx;
            $ins->execute([
                $ext,
                max(0, $sort),
                (string) ($r['customer'] ?? ''),
                (string) ($r['orNo'] ?? ''),
                (string) ($r['date'] ?? ''),
                (string) ($r['orderRef'] ?? ''),
                (string) ($r['cashier'] ?? ''),
                (float) ($r['amount'] ?? 0),
                (float) ($r['vat'] ?? 0),
                (string) ($r['remarks'] ?? ''),
            ]);
        }
        $pdo->commit();
        echo json_encode(['ok' => true, 'saved' => count($body['rows'])]);
    } catch (Throwable $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
