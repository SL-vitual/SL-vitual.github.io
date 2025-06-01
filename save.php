<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents('php://input'), true);
if(empty($data['week'])) {
    die(json_encode(['error' => '缺少周次参数']));
}

// 修改为 Windows 路径（使用反斜杠 \）
$dataDir = __DIR__ . '\\data';
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0777, true);
}

$file = $dataDir . "\\week_{$data['week']}.json";
file_put_contents($file, json_encode($data));

echo json_encode(['success' => true]);
?>
