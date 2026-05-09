<?php
declare(strict_types=1);

$configPath = dirname(__DIR__) . '/config.php';
if (!is_readable($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Missing config.php — copy config.sample.php to config.php']);
    exit;
}

/** @var array{db: array{host:string,port:int,name:string,user:string,pass:string,charset:string}} $cfg */
$cfg = require $configPath;
$d = $cfg['db'];

$dsn = sprintf(
    'mysql:host=%s;port=%d;dbname=%s;charset=%s',
    $d['host'],
    $d['port'],
    $d['name'],
    $d['charset']
);

return new PDO($dsn, $d['user'], $d['pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
