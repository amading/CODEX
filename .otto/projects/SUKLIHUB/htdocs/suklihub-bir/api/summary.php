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
        'SELECT line_key AS id, label, value_text AS value, hint, sort_order AS sortOrder
         FROM bir_vat_summary_line ORDER BY sort_order ASC, id ASC'
    );
    echo json_encode(['ok' => true, 'rows' => $stmt->fetchAll()]);
    exit;
}

if ($method === 'POST' || $method === 'PUT') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw ?: 'null', true);
    if (!is_array($body) || !isset($body['rows']) || !is_array($body['rows'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Expected JSON { "rows": [ { "id","label","value","hint?" } ] }']);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $pdo->exec('DELETE FROM bir_vat_summary_line');
        $ins = $pdo->prepare(
            'INSERT INTO bir_vat_summary_line (line_key, label, value_text, hint, sort_order)
             VALUES (?, ?, ?, ?, ?)'
        );
        $order = 0;
        foreach ($body['rows'] as $r) {
            if (!is_array($r)) {
                continue;
            }
            $ins->execute([
                (string) ($r['id'] ?? ''),
                (string) ($r['label'] ?? ''),
                (string) ($r['value'] ?? ''),
                isset($r['hint']) ? (string) $r['hint'] : null,
                (int) ($r['sortOrder'] ?? $order++),
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
