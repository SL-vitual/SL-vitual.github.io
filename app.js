document.addEventListener('DOMContentLoaded', function() {
    timetable.init();
});

const timetable = (function() {
    // 手写课程数据（week = 16 为例）
    let timetableData = [
        {
            id: "math-mon-am",
            week: 16,
            day: 0,
            time: 0,
            name: "数学",
            teacher: "张老师",
            classroom: "301",
            color: "#4CAF50"
        },
        {
            id: "english-wed-pm",
            week: 16,
            day: 2,
            time: 2,
            name: "英语",
            teacher: "李老师",
            classroom: "402",
            color: "#2196F3"
        }
    ];

    let currentWeek = 16;
    const MAX_WEEKS = 23;

    return {
        init: function() {
            const savedBg = localStorage.getItem('timetableBg');
            if (savedBg) {
                document.body.style.backgroundImage = `url('${savedBg}')`;
            }

            this.generateTimetable();
            this.renderTimetable();
            this.updateWeekDisplay();
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

                // 时间列
                const timeCell = document.createElement('td');
                timeCell.textContent = time;
                row.appendChild(timeCell);

                // 周一到周日
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
            document.querySelectorAll('#timetable td[data-day]').forEach(cell => {
                cell.innerHTML = '';
            });

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

