<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// 简单认证检查
if(empty($_SERVER['HTTP_REFERER']) || !str_contains($_SERVER['HTTP_REFERER'], 'your-site-url')) {
    die(json_encode(['error' => '非法访问']));
}

$data = json_decode(file_get_contents('php://input'), true);

if(empty($data['week'])) {
    die(json_encode(['error' => '缺少周次参数']));
}

// 创建data目录
if (!file_exists('data')) {
    mkdir('data', 0777, true);
}

$file = "data/week_{$data['week']}.json";
file_put_contents($file, json_encode($data));

echo json_encode(['success' => true]);
?>
