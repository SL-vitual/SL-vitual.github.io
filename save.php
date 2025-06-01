<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // 允许跨域
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

// 简单验证
if(empty($data['week'])) {
    die(json_encode(['error' => '缺少周次参数']));
}

// 创建data目录如果不存在
if (!file_exists('data')) {
    mkdir('data', 0777, true);
}

$file = "data/week_{$data['week']}.json";
file_put_contents($file, json_encode($data));

echo json_encode(['success' => true]);
?>
