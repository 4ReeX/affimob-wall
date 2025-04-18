<?php
header('Content-Type: application/json');

$provider = $_POST['provider'] ?? '';
$landing = $_POST['landing'] ?? '';
$landingPath = realpath(__DIR__.'/LP/'.$provider.'/'.$landing);

// Проверка безопасности
if(!$landingPath || !is_dir($landingPath)) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'Invalid path']));
}

$zipFile = __DIR__."/zips/{$provider}/{$landing}.zip";

// Если архив уже существует - отдаем его
if(file_exists($zipFile)) {
    echo json_encode([
        'success' => true,
        'file' => "zips/{$provider}/{$landing}.zip",
        'filename' => "{$landing}.zip"
    ]);
    exit;
}

// Если нет - создаем через Node.js скрипт
exec("node ".escapeshellarg(__DIR__.'/generate-screenshot.js')." ".escapeshellarg($landingPath)." ".escapeshellarg(__DIR__.'/screenshots')." ".escapeshellarg(__DIR__.'/zips'), $output, $returnCode);

if($returnCode === 0 && file_exists($zipFile)) {
    echo json_encode([
        'success' => true,
        'file' => "zips/{$provider}/{$landing}.zip",
        'filename' => "{$landing}.zip"
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Archive creation failed']);
}
