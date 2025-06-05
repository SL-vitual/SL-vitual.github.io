const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static('public'));

// 获取根目录下的图片列表
app.get('/get-images', (req, res) => {
    const imagesDir = path.join(__dirname, 'public'); // 假设图片在 public 目录下
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).send('无法读取图片目录');
        }
        const images = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
        res.json({ images });
    });
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
