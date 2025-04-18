<?php
header('Content-Type: application/json');

$provider = $_POST['provider'] ?? '';
$landing = $_POST['landing'] ?? '';
$basePath = realpath(__DIR__.'/LP/'.$provider.'/'.$landing);

// Проверки безопасности
if(!$basePath || !is_dir($basePath)) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'Invalid path']));
}

// Генерация уникального имени файла
$outputDir = __DIR__.'/screenshots/'.$provider;
$zipDir = __DIR__.'/zips/'.$provider;
$screenshotName = sprintf('%s_%s_%s.png', $provider, $landing, date('Ymd-His'));
$nodeScript = __DIR__.'/generate-screenshot.js';

// Вызов Node.js скрипта
exec("node {$nodeScript} ".escapeshellarg($basePath)." ".escapeshellarg($outputDir)." ".escapeshellarg($zipDir), $output, $returnCode);

if($returnCode !== 0) {
    http_response_code(500);
    die(json_encode(['success' => false, 'error' => 'Screenshot generation failed']));
}

// Возвращаем последний созданный скриншот
echo json_encode([
    'success' => true,
    'file' => 'screenshots/'.$provider.'/'.$landing.'/'.$screenshotName,
    'filename' => $screenshotName
]);
