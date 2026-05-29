<?php
declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$payload = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$name = trim((string)($payload['name'] ?? ''));
$email = trim((string)($payload['email'] ?? ''));
$phone = trim((string)($payload['phone'] ?? 'Not provided'));
$project = trim((string)($payload['project'] ?? 'Not provided'));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and a valid email are required']);
    exit;
}

$recipients = ['oviatech.ca@gmail.com', 'bhupindersinght20@gmail.com'];
$from = 'Ovia Tech Leads <leads@oviatech.com>';
$subject = 'New Lead from Ovia Tech Chatbot - ' . $name;

$safeName = esc_html($name);
$safeEmail = esc_html($email);
$safePhone = esc_html($phone !== '' ? $phone : 'Not provided');
$safeProject = nl2br(esc_html($project !== '' ? $project : 'Not provided'));

$html = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px;">
  <div style="background:#fff;border-radius:12px;max-width:560px;margin:0 auto;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
    <div style="background:#0f172a;padding:28px 32px;">
      <div style="display:inline-block;background:#eb4604;color:#fff;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;">New Lead</div>
      <h1 style="color:#fff;margin:12px 0 0;font-size:20px;">New Chatbot Lead - Ovia Tech</h1>
      <p style="color:rgba(255,255,255,.62);margin:6px 0 0;font-size:13px;">Captured via Aria chatbot on oviatech.com</p>
    </div>
    <div style="padding:28px 32px;color:#111;">
      <p><strong>Name:</strong> {$safeName}</p>
      <p><strong>Email:</strong> <a href="mailto:{$safeEmail}" style="color:#eb4604;">{$safeEmail}</a></p>
      <p><strong>Phone:</strong> {$safePhone}</p>
      <p><strong>Project:</strong><br>{$safeProject}</p>
    </div>
    <div style="background:#f8fafc;padding:16px 32px;text-align:center;color:#94a3b8;font-size:12px;">Sent by Aria - Ovia Tech chatbot - oviatech.com</div>
  </div>
</body>
</html>
HTML;

$text = "New Lead from Ovia Tech Chatbot\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Phone: " . ($phone !== '' ? $phone : 'Not provided') . "\n"
    . "Project: " . ($project !== '' ? $project : 'Not provided') . "\n";

$sent = send_resend_email([
    'from' => $from,
    'to' => $recipients,
    'reply_to' => sanitize_header($name) . ' <' . $email . '>',
    'subject' => $subject,
    'html' => $html,
    'text' => $text,
]);

if ($sent['ok']) {
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(500);
echo json_encode(['error' => 'Failed to send email', 'detail' => $sent['detail']]);

function esc_html(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function sanitize_header(string $value): string {
    return trim(str_replace(["\r", "\n"], '', $value));
}

function send_resend_email(array $payload): array {
    $apiKey = getenv('RESEND_API_KEY');
    if (!$apiKey) {
        return ['ok' => false, 'detail' => 'RESEND_API_KEY environment variable is not set'];
    }

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 15,
    ]);

    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response !== false && $status >= 200 && $status < 300) {
        return ['ok' => true, 'detail' => $response];
    }

    return ['ok' => false, 'detail' => $error !== '' ? $error : (string)$response];
}
