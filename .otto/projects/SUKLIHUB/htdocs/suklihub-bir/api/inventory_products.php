<?php
declare(strict_types=1);

/**
 * Per-store inventory (quantities / prices). Separate from products_catalog.
 * Typical flow: lookup products_catalog → user confirms → INSERT here with catalog_id set.
 */

require dirname(__DIR__) . '/includes/cors.php';
require dirname(__DIR__) . '/includes/barcode.php';

try {
    $pdo = require dirname(__DIR__) . '/includes/db.php';
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
    exit;
}

function map_inventory_row(array $r): array
{
    return [
        'id' => (int) $r['id'],
        'storeKey' => $r['store_key'],
        'catalogId' => $r['catalog_id'] !== null ? (int) $r['catalog_id'] : null,
        'externalId' => $r['external_id'],
        'name' => $r['name'],
        'barcode' => $r['barcode'],
        'barcodeNormalized' => $r['barcode_normalized'],
        'qrCode' => $r['qr_code'],
        'category' => $r['category'],
        'brand' => $r['brand'],
        'unit' => $r['unit'],
        'quantity' => (int) $r['quantity'],
        'costPrice' => (float) $r['cost_price'],
        'sellingPrice' => (float) $r['selling_price'],
        'supplier' => $r['supplier'],
        'expirationDate' => $r['expiration_date'],
        'stockLocation' => $r['stock_location'],
        'minStock' => (int) $r['min_stock'],
        'isDeliveryItem' => (bool) $r['is_delivery_item'],
        'isBirItem' => (bool) $r['is_bir_item'],
        'notes' => $r['notes'],
        'imageUrl' => $r['image_url'],
        'status' => $r['status'],
        'updatedAt' => $r['updated_at'],
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$storeKey = isset($_GET['store_key']) ? trim((string) $_GET['store_key']) : 'default';
if ($storeKey === '') {
    $storeKey = 'default';
}

if ($method === 'GET') {
    $stmt = $pdo->prepare(
        'SELECT * FROM inventory_products WHERE store_key = ? ORDER BY name ASC'
    );
    $stmt->execute([$storeKey]);
    $rows = array_map('map_inventory_row', $stmt->fetchAll(PDO::FETCH_ASSOC));
    echo json_encode(['ok' => true, 'storeKey' => $storeKey, 'rows' => $rows]);
    exit;
}

if ($method === 'POST' || $method === 'PUT') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw ?: 'null', true);
    if (!is_array($body) || !isset($body['rows']) || !is_array($body['rows'])) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'error' => 'Expected JSON { "storeKey": "default", "rows": [ ... ] }',
        ]);
        exit;
    }

    $sk = isset($body['storeKey']) ? trim((string) $body['storeKey']) : $storeKey;
    if ($sk === '') {
        $sk = 'default';
    }

    $pdo->beginTransaction();
    try {
        $del = $pdo->prepare('DELETE FROM inventory_products WHERE store_key = ?');
        $del->execute([$sk]);

        $ins = $pdo->prepare(
            'INSERT INTO inventory_products (
              store_key, catalog_id, external_id, name, barcode, barcode_normalized, qr_code,
              category, brand, unit, quantity, cost_price, selling_price, supplier,
              expiration_date, stock_location, min_stock, is_delivery_item, is_bir_item,
              notes, image_url, status
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )'
        );

        foreach (array_values($body['rows']) as $r) {
            if (!is_array($r)) {
                continue;
            }
            $barcode = (string) ($r['barcode'] ?? '');
            $norm = suklihub_normalize_barcode($barcode !== '' ? $barcode : (string) ($r['barcodeNormalized'] ?? ''));
            if ($norm === '') {
                continue;
            }
            $catalogId = $r['catalogId'] ?? null;
            if ($catalogId === '' || $catalogId === false) {
                $catalogId = null;
            } elseif ($catalogId !== null) {
                $catalogId = (int) $catalogId;
            }
            $ext = $r['externalId'] ?? null;
            if ($ext !== null && $ext !== '') {
                $ext = (string) $ext;
            } else {
                $ext = null;
            }
            $exp = $r['expirationDate'] ?? null;
            if ($exp !== null && $exp !== '') {
                $parts = preg_split('/T/', (string) $exp, 2);
                $exp = $parts !== false ? $parts[0] : null;
            } else {
                $exp = null;
            }

            $st = strtolower((string) ($r['status'] ?? 'in_stock'));
            if (! in_array($st, ['in_stock', 'low_stock', 'out_of_stock'], true)) {
                $st = 'in_stock';
            }

            $ins->execute([
                $sk,
                $catalogId,
                $ext,
                (string) ($r['name'] ?? ''),
                $barcode !== '' ? $barcode : $norm,
                $norm,
                (string) ($r['qrCode'] ?? ''),
                (string) ($r['category'] ?? ''),
                (string) ($r['brand'] ?? ''),
                trim((string) ($r['unit'] ?? '')) ?: 'pc',
                (int) ($r['quantity'] ?? 0),
                (float) ($r['costPrice'] ?? 0),
                (float) ($r['sellingPrice'] ?? 0),
                (string) ($r['supplier'] ?? ''),
                $exp ?: null,
                (string) ($r['stockLocation'] ?? ''),
                (int) ($r['minStock'] ?? 0),
                !empty($r['isDeliveryItem']) ? 1 : 0,
                !empty($r['isBirItem']) ? 1 : 0,
                isset($r['notes']) && (string) $r['notes'] !== '' ? (string) $r['notes'] : null,
                isset($r['imageUrl']) && (string) $r['imageUrl'] !== '' ? (string) $r['imageUrl'] : null,
                $st,
            ]);
        }

        $pdo->commit();
        echo json_encode(['ok' => true, 'storeKey' => $sk, 'saved' => count($body['rows'])]);
    } catch (Throwable $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
