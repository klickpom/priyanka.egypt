<?php
declare(strict_types=1);

const STORE_SEED = __DIR__ . '/../data/store.json';
const PUBLIC_UPLOAD_DIR = __DIR__ . '/../images/uploads';

function json_out(array $payload, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function persistent_dir(): string
{
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }
    $candidates = [
        dirname(__DIR__, 2) . '/priyanka-data',
        __DIR__ . '/../data',
    ];
    foreach ($candidates as $dir) {
        if (is_dir($dir) && is_writable($dir)) {
            return $cached = $dir;
        }
        if (!is_dir($dir) && @mkdir($dir, 0755, true) && is_writable($dir)) {
            return $cached = $dir;
        }
    }
    return $cached = __DIR__ . '/../data';
}

function store_live_path(): string
{
    return persistent_dir() . '/store.live.json';
}

function auth_path(): string
{
    return persistent_dir() . '/auth.json';
}

function upload_persist_dir(): string
{
    $dir = persistent_dir() . '/uploads';
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        json_out(['ok' => false, 'error' => 'تعذّر إنشاء مجلد الصور.'], 500);
    }
    return $dir;
}

function boot_session(): void
{
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_name('priyanka_admin');
    session_set_cookie_params([
        'lifetime' => 60 * 60 * 24 * 14,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function require_csrf(): void
{
    $sent = $_SERVER['HTTP_X_CSRF'] ?? ($_POST['csrf'] ?? '');
    if (!hash_equals((string) ($_SESSION['csrf'] ?? ''), (string) $sent)) {
        json_out(['ok' => false, 'error' => 'جلسة غير صالحة. حدّثوا الصفحة.'], 403);
    }
}

function is_authed(): bool
{
    return !empty($_SESSION['admin']);
}

function require_auth(): void
{
    if (!is_authed()) {
        json_out(['ok' => false, 'error' => 'يلزم تسجيل الدخول.'], 401);
    }
}

function auth_exists(): bool
{
    return is_file(auth_path());
}

function read_json_file(string $path): ?array
{
    if (!is_file($path)) {
        return null;
    }
    $raw = file_get_contents($path);
    if ($raw === false || $raw === '') {
        return null;
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : null;
}

function write_json_file(string $path, array $data): void
{
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        json_out(['ok' => false, 'error' => 'تعذّر إنشاء مجلد الحفظ.'], 500);
    }
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false || file_put_contents($path, $json . "\n", LOCK_EX) === false) {
        json_out(['ok' => false, 'error' => 'تعذّر حفظ الملف على السيرفر.'], 500);
    }
}

function load_store(): array
{
    $live = read_json_file(store_live_path());
    if (is_array($live) && !empty($live['products'])) {
        return $live;
    }
    $publicLive = read_json_file(__DIR__ . '/../data/store.live.json');
    if (is_array($publicLive) && !empty($publicLive['products'])) {
        return $publicLive;
    }
    $seed = read_json_file(STORE_SEED);
    return is_array($seed) ? $seed : [];
}
