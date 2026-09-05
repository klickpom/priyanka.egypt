<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';

boot_session();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    json_out(['ok' => true, 'store' => load_store(), 'live' => is_file(store_live_path())]);
}

require_auth();
require_csrf();

if ($method !== 'POST' && $method !== 'PUT') {
    json_out(['ok' => false, 'error' => 'طريقة غير مدعومة.'], 405);
}

$input = json_decode(file_get_contents('php://input') ?: '{}', true);
if (!is_array($input)) {
    json_out(['ok' => false, 'error' => 'بيانات غير صالحة.'], 400);
}

$store = $input['store'] ?? $input;
if (!is_array($store) || empty($store['products']) || !is_array($store['products'])) {
    json_out(['ok' => false, 'error' => 'يلزم وجود قائمة منتجات.'], 400);
}

$store['version'] = 1;
$store['updatedAt'] = gmdate('c');
write_json_file(store_live_path(), $store);
json_out(['ok' => true, 'updatedAt' => $store['updatedAt']]);
