const CONFIG = {
    sitePassword: "school2303",
    bilibiliUrl: "https://space.bilibili.com/3546599114410457",
    avatarImage: "IMG_202506023085_128x128.png",
    backgroundOptions: [
        { value: "4月掉粉月刊.png", label: "工地工人" },
        { value: "粉舰周刊2.png", label: "实验室研究员" },
        { value: "", label: "纯白色" }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('footerAvatar').src = CONFIG.avatarImage;
    document.getElementById('footerBilibiliLink').href = CONFIG.bilibiliUrl;
    
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
    };
    
    document.getElementById('sitePassword').addEventListener('keypress', function(e) {
        if(e.key === 'Enter') checkSitePassword();
    });
    
    if(localStorage.getItem('siteAuth') === 'true') {
        timetable.init();
        loadSettings();
    }
});

function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function changeBackground() {
    const bg = document.getElementById('bgSelect').value;
    document.body.style.backgroundImage = bg ? `url(${bg})` : 'none';
    localStorage.setItem('background', bg);
}

function changeFont() {
    const font = document.getElementById('fontSelect').value;
    document.body.style.fontFamily = font;
    localStorage.setItem('fontFamily', font);
}

function changeOpacity() {
    const opacity = document.getElementById('opacityControl').value;
    document.querySelector('.container').style.background = `rgba(255, 255, 255, ${opacity})`;
    localStorage.setItem('containerOpacity', opacity);
}

function loadSettings() {
    const savedBg = localStorage.getItem('background') || '';
    document.getElementById('bgSelect').value = savedBg;
    document.body.style.backgroundImage = savedBg ? `url(${savedBg})` : 'none';

    const savedFont = localStorage.getItem('fontFamily') || "'Arial', sans-serif";
    document.getElementById('fontSelect').value = savedFont;
    document.body.style.fontFamily = savedFont;

    const savedOpacity = localStorage.getItem('containerOpacity') || '0.7';
    document.getElementById('opacityControl').value = savedOpacity;
    document.querySelector('.container').style.background = `rgba(255, 255, 255, ${savedOpacity})`;
}

const timetable = (function() {
    const timetableData = [
        { week: 1, day: 0, time: 0, name: "数学", teacher: "张老师", classroom: "301", color: "rgba(76, 175, 80, 0.8)" },
        { week: 1, day: 0, time: 1, name: "英语", teacher: "李老师", classroom: "302", color: "rgba(33, 150, 243, 0.8)" },
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
