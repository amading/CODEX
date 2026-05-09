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
    $stmt = $pdo->query('SELECT setting_key AS k, setting_value AS v FROM bir_settings ORDER BY setting_key ASC');
    $pairs = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $pairs[(string) $row['k']] = $row['v'];
    }
    echo json_encode(['ok' => true, 'settings' => $pairs]);
    exit;
}

if ($method === 'POST' || $method === 'PUT') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw ?: 'null', true);
    if (!is_array($body) || !isset($body['settings']) || !is_array($body['settings'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Expected JSON { "settings": { "key": "value", ... } }']);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $upd = $pdo->prepare(
            'INSERT INTO bir_settings (setting_key, setting_value) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
        );
        foreach ($body['settings'] as $key => $val) {
            if (!is_string($key) || $key === '') {
                continue;
            }
            if (strlen($key) > 64) {
                throw new InvalidArgumentException('setting key too long: ' . $key);
            }
            $upd->execute([$key, $val === null ? null : (string) $val]);
        }
        $pdo->commit();
        echo json_encode(['ok' => true, 'updated' => count($body['settings'])]);
    } catch (Throwable $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
