<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';

$name = basename((string) ($_GET['f'] ?? ''));
if (!preg_match('/^p-\d{14}-[a-f0-9]{6}\.(jpg|png|webp)$/', $name)) {
    http_response_code(404);
    exit;
}

$path = upload_persist_dir() . '/' . $name;
$public = PUBLIC_UPLOAD_DIR . '/' . $name;
$file = is_file($path) ? $path : (is_file($public) ? $public : '');
if ($file === '') {
    http_response_code(404);
    exit;
}

$ext = strtolower((string) pathinfo($name, PATHINFO_EXTENSION));
$mimes = [
    'jpg' => 'image/jpeg',
    'png' => 'image/png',
    'webp' => 'image/webp',
];
header('Content-Type: ' . ($mimes[$ext] ?? 'application/octet-stream'));
header('Cache-Control: public, max-age=31536000, immutable');
header('X-Content-Type-Options: nosniff');
readfile($file);
