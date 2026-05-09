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
        'SELECT id, external_id AS externalId, sort_order AS sortOrder, supplier, invoice_no AS invoice,
                purchase_date AS date, particulars, amount, vat
         FROM bir_purchase ORDER BY sort_order ASC, id ASC'
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
        $pdo->exec('DELETE FROM bir_purchase');
        $ins = $pdo->prepare(
            'INSERT INTO bir_purchase
                (external_id, sort_order, supplier, invoice_no, purchase_date, particulars, amount, vat)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
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
                (string) ($r['supplier'] ?? ''),
                (string) ($r['invoice'] ?? ''),
                (string) ($r['date'] ?? ''),
                (string) ($r['particulars'] ?? ''),
                (float) ($r['amount'] ?? 0),
                (float) ($r['vat'] ?? 0),
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
