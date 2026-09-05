<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';

boot_session();
require_auth();
require_csrf();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['ok' => false, 'error' => 'طريقة غير مدعومة.'], 405);
}

if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
    json_out(['ok' => false, 'error' => 'لم يُرفع ملف.'], 400);
}

$file = $_FILES['file'];
if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
    json_out(['ok' => false, 'error' => 'فشل رفع الصورة.'], 400);
}
if (($file['size'] ?? 0) > 4 * 1024 * 1024) {
    json_out(['ok' => false, 'error' => 'الصورة أكبر من 4 ميجا.'], 400);
}

$info = @getimagesize($file['tmp_name']);
if ($info === false) {
    json_out(['ok' => false, 'error' => 'الملف ليس صورة صالحة.'], 400);
}

$mime = $info['mime'] ?? '';
$map = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];
if (!isset($map[$mime])) {
    json_out(['ok' => false, 'error' => 'الصيغ المسموحة: JPG و PNG و WebP.'], 400);
}

$name = 'p-' . date('YmdHis') . '-' . bin2hex(random_bytes(3)) . '.' . $map[$mime];
$persist = upload_persist_dir() . '/' . $name;
if (!move_uploaded_file($file['tmp_name'], $persist)) {
    json_out(['ok' => false, 'error' => 'تعذّر حفظ الصورة.'], 500);
}

if (!is_dir(PUBLIC_UPLOAD_DIR)) {
    @mkdir(PUBLIC_UPLOAD_DIR, 0755, true);
}
@copy($persist, PUBLIC_UPLOAD_DIR . '/' . $name);

json_out(['ok' => true, 'url' => '/images/uploads/' . $name]);
