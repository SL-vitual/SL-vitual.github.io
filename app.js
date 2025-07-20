const CONFIG = {
    bilibiliUrl: "https://space.bilibili.com/3546599114410457",
    avatarImage: "IMG_202506023085_128x128.png",
    backgroundOptions: [
        { value: "4月掉粉月刊.png", label: "工地劳动" },
        { value: "粉舰周刊2.png", label: "实验室研究" },
        { value: "粉舰周刊104.png", label: "悠闲的一刻" },
        { value: "粉舰周刊103.png", label: "文职之日常" },
        { value: "粉舰周刊102期.png", label: "田间劳作" },
    ]
};


// 初始化课程表
document.addEventListener('DOMContentLoaded', function() {
    timetable.init();
    document.getElementById('footerAvatar').src = CONFIG.avatarImage;
    document.getElementById('footerBilibiliLink').href = CONFIG.bilibiliUrl;
});

//  document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('footerAvatar').src = CONFIG.avatarImage;
//     document.getElementById('footerBilibiliLink').href = CONFIG.bilibiliUrl;
    
//     if(localStorage.getItem('siteAuth') !== 'true') {
//         document.getElementById('passwordProtect').style.display = 'flex';
//     }

//     window.checkSitePassword = function() {
//         const input = document.getElementById('sitePassword').value;
//         if(input === CONFIG.sitePassword) {
//             localStorage.setItem('siteAuth', 'true');
//             document.getElementById('passwordProtect').style.display = 'none';
//             timetable.init();
//             loadSettings();
//         } else {
//             document.getElementById('passwordError').style.display = 'block';
//             document.getElementById('sitePassword').value = '';
//             document.getElementById('sitePassword').focus();
//         }
//     };
    
//     document.getElementById('sitePassword').addEventListener('keypress', function(e) {
//         if(e.key === 'Enter') checkSitePassword();
//     });
    
//     if(localStorage.getItem('siteAuth') === 'true') {
//         timetable.init();
//         loadSettings();
//     }
// });

function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function changeBackground() {
    const bg = document.getElementById('bgSelect').value;
    document.body.style.backgroundImage = bg ? `url(${bg})` : 'none';
    localStorage.setItem('background', bg);
}

// function changeFont() {
//     const font = document.getElementById('fontSelect').value;
//     document.body.style.fontFamily = font;
//     localStorage.setItem('fontFamily', font);
// }

function changeOpacity() {
    const opacity = document.getElementById('opacityControl').value;
    document.querySelector('.container').style.background = `rgba(255, 255, 255, ${opacity})`;
    localStorage.setItem('containerOpacity', opacity);
}

function loadSettings() {
    const savedBg = localStorage.getItem('background') || '';
    document.getElementById('bgSelect').value = savedBg;
    document.body.style.backgroundImage = savedBg ? `url(${savedBg})` : 'none';

    // const savedFont = localStorage.getItem('fontFamily') || "'Arial', sans-serif";
    // document.getElementById('fontSelect').value = savedFont;
    // document.body.style.fontFamily = savedFont;

    const savedOpacity = localStorage.getItem('containerOpacity') || '0.7';
    document.getElementById('opacityControl').value = savedOpacity;
    document.querySelector('.container').style.background = `rgba(255, 255, 255, ${savedOpacity})`;
}

// function switchLayout(mode) {
//     if(mode === 'desktop') {
//         document.body.classList.add('desktop-layout');
//         localStorage.setItem('preferredLayout', 'desktop');
//     } else {
//         document.body.classList.remove('desktop-layout');
//         localStorage.setItem('preferredLayout', 'mobile');
//     }
// }

// 初始化时读取用户偏好
// const savedLayout = localStorage.getItem('preferredLayout') || 'mobile';
// switchLayout(savedLayout);

// 请假条数据 (示例)
const leaveNotes = [
    { id: 1, img: "请假1.jpg", title: "请假条" },
    { id: 2, img: "微信图片_20250709092956_3.jpg", title: "请假条"}
    // 添加更多请假条...
];

// 渲染请假条
function renderLeaveNotes() {
    const container = document.getElementById('leaveNotes');
    container.innerHTML = leaveNotes.map(note => `
        <div class="leave-note" data-id="${note.id}"> 
             <img src="${note.img}" alt="${note.title}">
             <div class="note-title">${note.title.split(' ')[0]}</div>
             <button class="close-btn" style="display:none">×</button>
        </div>
    `).join('');

    // 添加点击事件
    document.querySelectorAll('.leave-note').forEach(note => {
        note.addEventListener('click', function() {
            if(this.classList.contains('expanded')) return;
            this.classList.add('expanded');
            this.querySelector('.close-btn').style.display = 'block';// 放大效果
            this.querySelector('.close-btn').addEventListener('click', (e) => {
                e.stopPropagation();// 添加关闭事件
                this.classList.remove('expanded');
                this.querySelector('.close-btn').style.display = 'none';
                });
        });
    });    
}

// 初始化
document.addEventListener('DOMContentLoaded', renderLeaveNotes);

// 模态框控制
let currentNoteIndex = 0;

function openModal(id) {
    const modal = document.getElementById('noteModal');
    const modalImg = document.getElementById('modalImage');
    
    currentNoteIndex = leaveNotes.findIndex(note => note.id == id);
    modalImg.src = leaveNotes[currentNoteIndex].img;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById('noteModal').style.display = "none";
}

function changeNote(n) {
    currentNoteIndex += n;
    if (currentNoteIndex >= leaveNotes.length) currentNoteIndex = 0;
    if (currentNoteIndex < 0) currentNoteIndex = leaveNotes.length - 1;
    document.getElementById('modalImage').src = leaveNotes[currentNoteIndex].img;
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    renderLeaveNotes();
    
    // 模态框事件
    document.querySelector('.close').addEventListener('click', closeModal);
    document.querySelector('.prev').addEventListener('click', () => changeNote(-1));
    document.querySelector('.next').addEventListener('click', () => changeNote(1));
    
    // 点击空白处关闭
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('noteModal')) {
            closeModal();
        }
    });
});

const timetable = (function() {
    const timetableData = [
        // { week: 16, day: 1, time: 4, name: "就业指导", teacher: "黄雪媛+郑彦汝", classroom: "线上", color: "rgba(22, 144, 243, 0.8)" },
        // { week: 16, day: 2, time: 3, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼504", color: "rgba(247, 220, 103, 0.8)" },
        // { week: 16, day: 3, time: 2, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        // { week: 16, day: 4, time: 3, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        // { week: 16, day: 5, time: 2, name: "大学生创新创业基础5", teacher: "柴旺", classroom: "阶梯教室二", color: "rgba(255, 102, 102, 0.8)" },
        // { week: 17, day: 1, time: 4, name: "就业指导", teacher: "黄雪媛+郑彦汝", classroom: "线上", color: "rgba(22, 144, 243, 0.8)" },
        // { week: 17, day: 2, time: 3, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼504", color: "rgba(247, 220, 103, 0.8)" },
        // { week: 17, day: 3, time: 2, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        // { week: 17, day: 4, time: 3, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        // { week: 17, day: 5, time: 2, name: "大学生创新创业基础5", teacher: "柴旺", classroom: "阶梯教室二", color: "rgba(255, 102, 102, 0.8)" },
        // { week: 18, day: 1, time: 4, name: "就业指导", teacher: "黄雪媛+郑彦汝", classroom: "线上", color: "rgba(22, 144, 243, 0.8)" },
        // { week: 18, day: 2, time: 3, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼504", color: "rgba(247, 220, 103, 0.8)" },
        // { week: 18, day: 3, time: 2, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        // { week: 18, day: 4, time: 3, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        // { week: 18, day: 5, time: 2, name: "大学生创新创业基础5", teacher: "柴旺", classroom: "阶梯教室二", color: "rgba(255, 102, 102, 0.8)" },
        // { week: 19, day: 1, time: 4, name: "就业指导", teacher: "黄雪媛+郑彦汝", classroom: "线上", color: "rgba(22, 144, 243, 0.8)" },
        // { week: 19, day: 3, time: 2, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 20, day: 0, time: 0, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 20, day: 0, time: 1, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 20, day: 0, time: 2, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 20, day: 0, time: 3, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 20, day: 1, time: 0, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 20, day: 1, time: 1, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 20, day: 2, time: 0, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 20, day: 2, time: 1, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 20, day: 2, time: 2, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 20, day: 3, time: 0, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 20, day: 3, time: 1, name: "工程招投标与合同管理【补课】", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 20, day: 3, time: 2, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 20, day: 3, time: 3, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 20, day: 4, time: 0, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 20, day: 4, time: 1, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 20, day: 4, time: 3, name: "就业指导", teacher: "黄雪媛+郑彦汝", classroom: "教学楼510", color: "rgba(252, 66, 227, 0.8)" },
        { week: 21, day: 0, time: 0, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 21, day: 0, time: 1, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 21, day: 0, time: 2, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 21, day: 0, time: 3, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 21, day: 1, time: 0, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 21, day: 1, time: 1, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 21, day: 2, time: 0, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 21, day: 2, time: 1, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 21, day: 2, time: 2, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 21, day: 3, time: 0, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 21, day: 3, time: 2, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 21, day: 3, time: 3, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 21, day: 4, time: 0, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 21, day: 4, time: 1, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 22, day: 0, time: 0, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 22, day: 0, time: 1, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 22, day: 0, time: 2, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 22, day: 0, time: 3, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 22, day: 1, time: 0, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 22, day: 1, time: 1, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 22, day: 2, time: 0, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 22, day: 2, time: 1, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 22, day: 2, time: 2, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 22, day: 3, time: 0, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 22, day: 3, time: 2, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 22, day: 3, time: 3, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 22, day: 4, time: 0, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 22, day: 4, time: 1, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 23, day: 0, time: 0, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 23, day: 0, time: 1, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 23, day: 0, time: 2, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 23, day: 0, time: 3, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 23, day: 1, time: 0, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 23, day: 1, time: 1, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 23, day: 2, time: 0, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 23, day: 2, time: 1, name: "工程招投标与合同管理", teacher: "陈广城", classroom: "交通楼201", color: "rgba(168, 230, 191, 0.8)" },
        { week: 23, day: 2, time: 2, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 23, day: 3, time: 0, name: "工程建设法律法规", teacher: "陈伟强", classroom: "交通楼201", color: "rgba(247, 220, 103, 0.8)" },
        { week: 23, day: 3, time: 2, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 23, day: 3, time: 3, name: "信息技术（专升本提升课）", teacher: "雷杰", classroom: "交通楼303", color: "rgba(164, 177, 248, 0.8)" },
        { week: 23, day: 4, time: 0, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 23, day: 4, time: 1, name: "安全生产管理", teacher: "杜喜朋", classroom: "交通楼201", color: "rgba(255, 128, 96, 0.8)" },
        { week: 23, day: 4, time: 3, name: "就业指导", teacher: "黄雪媛+郑彦汝", classroom: "线上", color: "rgba(252, 66, 227, 0.8)" },
    ];

    let currentWeek = 23;
    const MIN_WEEKS = 20;
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
                '一二节08:10-09:45', '三四节10:05-11:40', 
                '五六节14:30-16:05', '七八节16:20-17:55'
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
            if (currentWeek > MIN_WEEKS) {
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
