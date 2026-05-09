<?php
declare(strict_types=1);

require dirname(__DIR__) . '/includes/cors.php';
require dirname(__DIR__) . '/includes/barcode.php';

try {
    $pdo = require dirname(__DIR__) . '/includes/db.php';
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
    exit;
}

function map_catalog_row(array $r): array
{
    return [
        'id' => (int) $r['id'],
        'barcodeNormalized' => $r['barcode_normalized'],
        'name' => $r['name'],
        'brand' => $r['brand'],
        'category' => $r['category'],
        'unit' => $r['unit'],
        'imageUrl' => $r['image_url'],
        'suggestedPrice' => $r['suggested_price'] !== null ? (float) $r['suggested_price'] : null,
        'notes' => $r['notes'],
        'updatedAt' => $r['updated_at'],
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $barcode = isset($_GET['barcode']) ? suklihub_normalize_barcode((string) $_GET['barcode']) : '';
    if ($barcode !== '') {
        $stmt = $pdo->prepare(
            'SELECT id, barcode_normalized, name, brand, category, unit, image_url, suggested_price, notes, updated_at
             FROM products_catalog WHERE barcode_normalized = ? LIMIT 1'
        );
        $stmt->execute([$barcode]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            echo json_encode(['ok' => true, 'found' => false, 'product' => null]);
            exit;
        }
        echo json_encode(['ok' => true, 'found' => true, 'product' => map_catalog_row($row)]);
        exit;
    }

    $limit = min(500, max(1, (int) ($_GET['limit'] ?? 100)));
    $offset = max(0, (int) ($_GET['offset'] ?? 0));
    $stmt = $pdo->prepare(
        'SELECT id, barcode_normalized, name, brand, category, unit, image_url, suggested_price, notes, updated_at
         FROM products_catalog ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?'
    );
    $stmt->bindValue(1, $limit, PDO::PARAM_INT);
    $stmt->bindValue(2, $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = array_map('map_catalog_row', $stmt->fetchAll(PDO::FETCH_ASSOC));
    echo json_encode(['ok' => true, 'rows' => $rows, 'limit' => $limit, 'offset' => $offset]);
    exit;
}

if ($method === 'POST' || $method === 'PUT') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw ?: 'null', true);
    if (!is_array($body) || !isset($body['product']) || !is_array($body['product'])) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Expected JSON { "product": { "barcode", "name", ... } }']);
        exit;
    }
    $p = $body['product'];
    $norm = isset($p['barcodeNormalized']) ? suklihub_normalize_barcode((string) $p['barcodeNormalized'])
        : (isset($p['barcode']) ? suklihub_normalize_barcode((string) $p['barcode']) : '');
    if ($norm === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'barcode required (digits after normalize)']);
        exit;
    }

    $name = trim((string) ($p['name'] ?? ''));
    if ($name === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'name required']);
        exit;
    }

    $brand = trim((string) ($p['brand'] ?? ''));
    $category = trim((string) ($p['category'] ?? ''));
    $unit = trim((string) ($p['unit'] ?? '')) ?: 'pc';
    $imageUrl = isset($p['imageUrl']) ? trim((string) $p['imageUrl']) : '';
    $imageUrl = $imageUrl === '' ? null : $imageUrl;

    $suggest = null;
    if (array_key_exists('suggestedPrice', $p)) {
        if ($p['suggestedPrice'] === null || $p['suggestedPrice'] === '') {
            $suggest = null;
        } else {
            $suggest = (float) $p['suggestedPrice'];
        }
    }

    $notes = isset($p['notes']) ? trim((string) $p['notes']) : '';
    $notes = $notes === '' ? null : $notes;

    $sql = 'INSERT INTO products_catalog
        (barcode_normalized, name, brand, category, unit, image_url, suggested_price, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        brand = VALUES(brand),
        category = VALUES(category),
        unit = VALUES(unit),
        image_url = COALESCE(VALUES(image_url), image_url),
        suggested_price = VALUES(suggested_price),
        notes = VALUES(notes)';

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $norm,
            $name,
            $brand,
            $category,
            $unit,
            $imageUrl,
            $suggest,
            $notes,
        ]);

        $sel = $pdo->prepare(
            'SELECT id, barcode_normalized, name, brand, category, unit, image_url, suggested_price, notes, updated_at
             FROM products_catalog WHERE barcode_normalized = ? LIMIT 1'
        );
        $sel->execute([$norm]);
        $row = $sel->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['ok' => true, 'product' => $row ? map_catalog_row($row) : null]);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
