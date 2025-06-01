document.addEventListener('DOMContentLoaded', function() {
  const SITE_PASSWORD = "school2303";
  
  if(localStorage.getItem('siteAuth') !== 'true') {
    document.getElementById('passwordProtect').style.display = 'flex';
  }

  window.checkSitePassword = function() {
    const input = document.getElementById('sitePassword').value;
    if(input === SITE_PASSWORD) {
      localStorage.setItem('siteAuth', 'true');
      document.getElementById('passwordProtect').style.display = 'none';
      timetable.init();
    } else {
      document.getElementById('passwordError').style.display = 'block';
      document.getElementById('sitePassword').value = '';
      document.getElementById('sitePassword').focus();
    }
  }
  
  document.getElementById('sitePassword').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') checkSitePassword();
  });
});

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
