document.addEventListener('DOMContentLoaded', function() {
  const SITE_PASSWORD = "school2303"; // 改成你的密码
  
  // 检查是否已认证
  if(localStorage.getItem('siteAuth') !== 'true') {
    document.body.classList.add('protected-mode');
    document.getElementById('passwordProtect').style.display = 'flex';
  }

  // 绑定验证函数到全局
  window.checkSitePassword = function() {
    const input = document.getElementById('sitePassword').value;
    if(input === SITE_PASSWORD) {
      localStorage.setItem('siteAuth', 'true');
      document.body.classList.remove('protected-mode');
      document.getElementById('passwordProtect').style.display = 'none';
      timetable.init(); // 确保课程表初始化
    } else {
      document.getElementById('passwordError').style.display = 'block';
      document.getElementById('sitePassword').value = ''; // 清空输入框
      document.getElementById('sitePassword').focus(); // 重新聚焦
    }
  }
  
  // 回车键支持
  document.getElementById('sitePassword').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') checkSitePassword();
  });
});

const timetable = (function() {
    // 课程数据 - 直接定义在JS中
    const timetableData = [
        // 第1周课程示例
        { week: 1, day: 0, time: 0, name: "数学", teacher: "张老师", classroom: "301", color: "#4CAF50" },
        { week: 1, day: 0, time: 1, name: "英语", teacher: "李老师", classroom: "302", color: "#2196F3" },
        { week: 1, day: 1, time: 2, name: "物理", teacher: "王老师", classroom: "实验室", color: "#9C27B0" },
        { week: 1, day: 2, time: 3, name: "化学", teacher: "赵老师", classroom: "实验室", color: "#FF9800" },
        { week: 1, day: 3, time: 4, name: "体育", teacher: "刘老师", classroom: "操场", color: "#795548" },
        
        // 第2周课程示例
        { week: 2, day: 0, time: 0, name: "语文", teacher: "陈老师", classroom: "303", color: "#E91E63" },
        { week: 2, day: 1, time: 1, name: "历史", teacher: "孙老师", classroom: "304", color: "#607D8B" },
        { week: 2, day: 2, time: 2, name: "地理", teacher: "周老师", classroom: "305", color: "#3F51B5" },
        
        // 可以继续添加更多周的课程...
    ];

    let currentWeek = 1;
    const MAX_WEEKS = 23;

    // 公共方法
    return {
        init: function() {
            const savedBg = localStorage.getItem('timetableBg');
            if (savedBg) {
                document.body.style.backgroundImage = `url('${savedBg}')`;
            }
            
            this.generateTimetable();
            this.renderTimetable();
            this.updateWeekDisplay();
            document.getElementById('weekNavigation').style.display = 'block';
        },

        generateTimetable: function() {
            const timetable = document.getElementById('timetable').getElementsByTagName('tbody')[0];
            timetable.innerHTML = '';
            
            const timeSlots = [
                '一二节08:20-09:55', '三四节10:15-11:50', '五六节14:30-16:05',
                '七八节16:20-17:55', '九十节19:30-21:05'
            ];
            
            timeSlots.forEach((time, timeIndex) => {
                const row = document.createElement('tr');
                
                // 添加时间列
                const timeCell = document.createElement('td');
                timeCell.textContent = time;
                row.appendChild(timeCell);
                
                // 添加每天的课程格子
                for (let day = 0; day < 7; day++) {
                    const cell = document.createElement('td');
                    cell.dataset.day = day;
                    cell.dataset.time = timeIndex;
                    row.appendChild(cell);
                }
                
                timetable.appendChild(row);
            });
        },

        renderTimetable: function() {
            // 清空所有格子
            document.querySelectorAll('#timetable td[data-day]').forEach(cell => {
                cell.innerHTML = '';
            });
            
            // 只渲染当前周的课程
            const currentWeekCourses = timetableData.filter(course => course.week === currentWeek);
            
            currentWeekCourses.forEach(course => {
                const cell = document.querySelector(`#timetable td[data-day="${course.day}"][data-time="${course.time}"]`);
                if (cell) {
                    cell.innerHTML = `
                        <div class="course" style="background:${course.color || '#4CAF50'}">
                            <strong>${course.name}</strong>
                            ${course.teacher ? `<div>${course.teacher}</div>` : ''}
                            ${course.classroom ? `<div>${course.classroom}</div>` : ''}
                        </div>
                    `;
                }
            });
        },

        changeBackground: function() {
            const bgUrl = document.getElementById('bgImageUrl').value.trim();
            if (bgUrl) {
                document.body.style.backgroundImage = `url('${bgUrl}')`;
                localStorage.setItem('timetableBg', bgUrl);
                alert('背景已更新！');
            } else {
                alert('请输入有效的图片URL');
            }
        },

        resetBackground: function() {
            document.body.style.backgroundImage = '';
            localStorage.removeItem('timetableBg');
            document.getElementById('bgImageUrl').value = '';
            alert('背景已重置为默认');
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
