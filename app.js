// 配置项
const CONFIG = {
    sitePassword: "school2303",
    bilibiliUrl: "https://space.bilibili.com/你的B站ID",
    avatarImage: "author-avatar.jpg",
    backgroundOptions: [
        { value: "", label: "无背景" },
        { value: "bg1.jpg", label: "背景1" },
        { value: "bg2.jpg", label: "背景2" }
    ],
    fontOptions: [
        { value: "'Arial', sans-serif", label: "默认" },
        { value: "'Noto Sans SC', sans-serif", label: "思源黑体" },
        { value: "'ZCOOL KuaiLe', cursive", label: "酷楷体" },
        { value: "'Ma Shan Zheng', cursive", label: "马善政体" }
    ]
};

// 密码保护功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化作者信息
    document.getElementById('authorAvatar').src = CONFIG.avatarImage;
    document.getElementById('bilibiliLink').href = CONFIG.bilibiliUrl;
    
    // 密码验证
    if(localStorage.getItem('siteAuth') !== 'true') {
        document.getElementById('passwordProtect').style.display = 'flex';
    }

    window.checkSitePassword = function() {
        const input = document.getElementById('sitePassword').value;
        if(input === CONFIG.sitePassword) {
            localStorage.setItem('siteAuth', 'true');
            document.getElementById('passwordProtect').style.display = 'none';
            timetable.init();
            loadSettings();
        } else {
            document.getElementById('passwordError').style.display = 'block';
            document.getElementById('sitePassword').value = '';
            document.getElementById('sitePassword').focus();
        }
    }
    
    document.getElementById('sitePassword').addEventListener('keypress', function(e) {
        if(e.key === 'Enter') checkSitePassword();
    });
    
    // 如果已经认证，初始化课程表
    if(localStorage.getItem('siteAuth') === 'true') {
        timetable.init();
        loadSettings();
    }
});

// 设置功能
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function changeBackground() {
    const bg = document.getElementById('bgSelect').value;
    document.body.style.backgroundImage = bg ? `url(${bg})` : 'none';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    localStorage.setItem('background', bg);
}

function changeFont() {
    const font = document.getElementById('fontSelect').value;
    document.body.style.fontFamily = font;
    localStorage.setItem('fontFamily', font);
}

function toggleBold() {
    const isBold = document.getElementById('boldText').checked;
    document.body.style.fontWeight = isBold ? 'bold' : 'normal';
    localStorage.setItem('boldText', isBold);
}

function changeTextStroke() {
    const stroke = document.getElementById('textStroke').value;
    const textElements = document.querySelectorAll('h1, h2, h3, p, span, a, td, th');
    
    textElements.forEach(el => {
        if(stroke === 'none') {
            el.style.textShadow = 'none';
        } else {
            el.style.textShadow = `1px 1px 2px ${stroke}, -1px -1px 2px ${stroke}`;
        }
    });
    localStorage.setItem('textStroke', stroke);
}

function loadSettings() {
    // 背景
    const savedBg = localStorage.getItem('background') || '';
    document.getElementById('bgSelect').value = savedBg;
    document.body.style.backgroundImage = savedBg ? `url(${savedBg})` : 'none';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    
    // 字体
    const savedFont = localStorage.getItem('fontFamily') || "'Arial', sans-serif";
    document.getElementById('fontSelect').value = savedFont;
    document.body.style.fontFamily = savedFont;
    
    // 加粗
    const savedBold = localStorage.getItem('boldText') === 'true';
    document.getElementById('boldText').checked = savedBold;
    document.body.style.fontWeight = savedBold ? 'bold' : 'normal';
    
    // 描边
    const savedStroke = localStorage.getItem('textStroke') || 'none';
    document.getElementById('textStroke').value = savedStroke;
    const textElements = document.querySelectorAll('h1, h2, h3, p, span, a, td, th');
    textElements.forEach(el => {
        if(savedStroke === 'none') {
            el.style.textShadow = 'none';
        } else {
            el.style.textShadow = `1px 1px 2px ${savedStroke}, -1px -1px 2px ${savedStroke}`;
        }
    });
}

// 课程表功能
const timetable = (function() {
    // 硬编码的课程数据
    const timetableData = [
        // 第1周
        { week: 1, day: 0, time: 0, name: "数学", teacher: "张老师", classroom: "301", color: "#4CAF50" },
        { week: 1, day: 0, time: 1, name: "英语", teacher: "李老师", classroom: "302", color: "#2196F3" },
        // 可以继续添加其他课程...
    ];

    let currentWeek = 1;
    const MAX_WEEKS = 23;

    return {
        init: function() {
            this.generateTimetable();
            this.renderTimetable();
            this.updateWeekDisplay();
            document.getElementById('weekNavigation').style.display = 'block';
        },

        generateTimetable: function() {
            const tbody = document.querySelector('#timetable tbody');
            tbody.innerHTML = '';
            
            const timeSlots = [
                '一二节08:20-09:55', '三四节10:15-11:50', 
                '五六节14:30-16:05', '七八节16:20-17:55', 
                '九十节19:30-21:05'
            ];
            
            timeSlots.forEach((time, timeIndex) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${time}</td>` + 
                    Array(7).fill().map((_, day) => 
                        `<td data-day="${day}" data-time="${timeIndex}"></td>`
                    ).join('');
                tbody.appendChild(row);
            });
        },

        renderTimetable: function() {
            document.querySelectorAll('#timetable td[data-day]').forEach(cell => {
                cell.innerHTML = '';
            });
            
            timetableData
                .filter(course => course.week === currentWeek)
                .forEach(course => {
                    const cell = document.querySelector(
                        `#timetable td[data-day="${course.day}"][data-time="${course.time}"]`
                    );
                    if (cell) {
                        cell.innerHTML = `
                            <div class="course" style="background:${course.color}">
                                <strong>${course.name}</strong>
                                <div>${course.teacher}</div>
                                <div>${course.classroom}</div>
                            </div>
                        `;
                    }
                });
        },

        prevWeek: function() {
            if (currentWeek > 1) {
                currentWeek--;
                this.updateWeekDisplay();
                this.renderTimetable();
            }
        },

        nextWeek: function() {
            if (currentWeek < MAX_WEEKS) {
                currentWeek++;
                this.updateWeekDisplay();
                this.renderTimetable();
            }
        },

        updateWeekDisplay: function() {
            document.getElementById('currentWeekDisplay').textContent = `第${currentWeek}周`;
        }
    };
})();
