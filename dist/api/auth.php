<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';

boot_session();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    json_out([
        'ok' => true,
        'setup' => !auth_exists(),
        'authed' => is_authed(),
        'csrf' => csrf_token(),
    ]);
}

$input = json_decode(file_get_contents('php://input') ?: '{}', true);
if (!is_array($input)) {
    $input = $_POST;
}

$action = (string) ($input['action'] ?? $_GET['action'] ?? '');

if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    json_out(['ok' => true]);
}

if ($action === 'setup') {
    if (auth_exists()) {
        json_out(['ok' => false, 'error' => 'كلمة المرور مضبوطة مسبقاً.'], 400);
    }
    $pass = (string) ($input['password'] ?? '');
    if (strlen($pass) < 8) {
        json_out(['ok' => false, 'error' => 'كلمة المرور لا تقل عن 8 أحرف.'], 400);
    }
    write_json_file(auth_path(), [
        'hash' => password_hash($pass, PASSWORD_DEFAULT),
        'created' => gmdate('c'),
    ]);
    $_SESSION['admin'] = true;
    json_out(['ok' => true, 'csrf' => csrf_token(), 'authed' => true]);
}

if ($action === 'login') {
    if (!auth_exists()) {
        json_out(['ok' => false, 'error' => 'اضبطوا كلمة المرور أولاً.', 'setup' => true], 400);
    }
    $attempts = (int) ($_SESSION['attempts'] ?? 0);
    if ($attempts > 12) {
        json_out(['ok' => false, 'error' => 'محاولات كثيرة. انتظروا قليلاً.'], 429);
    }
    $auth = read_json_file(auth_path()) ?? [];
    $pass = (string) ($input['password'] ?? '');
    if (!password_verify($pass, (string) ($auth['hash'] ?? ''))) {
        $_SESSION['attempts'] = $attempts + 1;
        json_out(['ok' => false, 'error' => 'كلمة المرور غير صحيحة.'], 401);
    }
    $_SESSION['attempts'] = 0;
    $_SESSION['admin'] = true;
    json_out(['ok' => true, 'csrf' => csrf_token(), 'authed' => true]);
}

if ($action === 'password') {
    require_auth();
    require_csrf();
    $next = (string) ($input['password'] ?? '');
    if (strlen($next) < 8) {
        json_out(['ok' => false, 'error' => 'كلمة المرور لا تقل عن 8 أحرف.'], 400);
    }
    $auth = read_json_file(auth_path()) ?? [];
    $auth['hash'] = password_hash($next, PASSWORD_DEFAULT);
    $auth['updated'] = gmdate('c');
    write_json_file(auth_path(), $auth);
    json_out(['ok' => true, 'csrf' => csrf_token()]);
}

json_out(['ok' => false, 'error' => 'طلب غير معروف.'], 400);
