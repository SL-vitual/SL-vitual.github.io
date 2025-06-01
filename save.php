<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

// 简单验证（实际使用时需要更严格的安全措施）
if(empty($data['week'])) {
    die(json_encode(['error' => '缺少周次参数']));
}

$file = "data/week_{$data['week']}.json";
file_put_contents($file, json_encode($data));

echo json_encode(['success' => true]);
?>