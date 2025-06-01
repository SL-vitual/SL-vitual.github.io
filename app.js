// 在app.js最前面添加（确保DOM加载完成）
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
    return {
        init: function() {
            const savedBg = localStorage.getItem('timetableBg');
            if (savedBg) {
                document.body.style.backgroundImage = `url('${savedBg}')`;
            }
            
            this.generateTimetable();
            this.loadTimetable();
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
                
                // 添加时间列
                const timeCell = document.createElement('td');
                timeCell.textContent = time;
                row.appendChild(timeCell);
                
                // 添加每天的课程格子
                for (let day = 0; day < 7; day++) {
                    const cell = document.createElement('td');
                    cell.dataset.day = day;
                    cell.dataset.time = timeIndex;
                    cell.addEventListener('click', this.handleCellClick.bind(this));
                    row.appendChild(cell);
                }
                
                timetable.appendChild(row);
            });
        },

        handleCellClick: function(event) {
            if (currentMode !== 'teacher') return;
            
            selectedCell = event.currentTarget;
            const day = parseInt(selectedCell.dataset.day);
            const time = parseInt(selectedCell.dataset.time);
            
            // 查找是否已有课程
            const existingCourse = timetableData.find(c => c.day === day && c.time === time && c.week === currentWeek);
            
            if (existingCourse) {
                // 编辑现有课程
                selectedCourseId = existingCourse.id;
                document.getElementById('modalTitle').textContent = '编辑课程';
                document.getElementById('modalCourseName').value = existingCourse.name;
                document.getElementById('modalTeacher').value = existingCourse.teacher;
                document.getElementById('modalClassroom').value = existingCourse.classroom;
                document.getElementById('modalColor').value = existingCourse.color || '#4CAF50';
                document.getElementById('deleteCourseBtn').style.display = 'inline-block';
            } else {
                // 添加新课程
                selectedCourseId = null;
                document.getElementById('modalTitle').textContent = '添加课程';
                document.getElementById('modalCourseName').value = '';
                document.getElementById('modalTeacher').value = '';
                document.getElementById('modalClassroom').value = '';
                document.getElementById('modalColor').value = '#4CAF50';
                document.getElementById('deleteCourseBtn').style.display = 'none';
            }
            
            document.getElementById('courseModal').style.display = 'flex';
        },

        saveCourse: function() {
            const name = document.getElementById('modalCourseName').value.trim();
            if (!name) {
                alert('请输入课程名称');
                return;
            }
            
            const day = parseInt(selectedCell.dataset.day);
            const time = parseInt(selectedCell.dataset.time);
            const teacher = document.getElementById('modalTeacher').value.trim();
            const classroom = document.getElementById('modalClassroom').value.trim();
            const color = document.getElementById('modalColor').value;
            
            if (selectedCourseId) {
                // 更新现有课程
                const index = timetableData.findIndex(c => c.id === selectedCourseId);
                if (index !== -1) {
                    timetableData[index] = {
                        id: selectedCourseId,
                        week: currentWeek,
                        day, time, name, teacher, classroom, color
                    };
                }
            } else {
                // 添加新课程
                const newCourse = {
                    id: Date.now().toString(),
                    week: currentWeek,
                    day, time, name, teacher, classroom, color
                };
                timetableData.push(newCourse);
            }
            
            this.renderTimetable();
            this.closeModal();
        },

        deleteCourse: function() {
            if (!selectedCourseId) return;
            
            if (confirm('确定要删除这个课程吗？')) {
                timetableData = timetableData.filter(c => c.id !== selectedCourseId);
                this.renderTimetable();
                this.closeModal();
            }
        },

        closeModal: function() {
            document.getElementById('courseModal').style.display = 'none';
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

        setViewMode: function(mode) {
            currentMode = mode;
            
            if (mode === 'teacher') {
                document.getElementById('editIndicator').style.display = 'inline';
                document.getElementById('timetableControls').style.display = 'block';
                document.getElementById('bgControls').style.display = 'block';
                document.getElementById('authPanel').style.display = 'none';
                document.getElementById('weekNavigation').style.display = 'block';
                
                // 启用编辑功能
                document.querySelectorAll('#timetable td[data-day]').forEach(cell => {
                    cell.style.cursor = 'pointer';
                });
            } else {
                document.getElementById('editIndicator').style.display = 'none';
                document.getElementById('timetableControls').style.display = 'none';
                document.getElementById('bgControls').style.display = 'none';
                document.getElementById('authPanel').style.display = 'block';
                document.getElementById('teacherLogin').style.display = 'none';
                document.getElementById('passwordError').style.display = 'none';
                document.getElementById('weekNavigation').style.display = 'block';
                
                // 禁用编辑功能
                document.querySelectorAll('#timetable td[data-day]').forEach(cell => {
                    cell.style.cursor = 'default';
                });
            }
        },

        showTeacherLogin: function() {
            document.getElementById('teacherLogin').style.display = 'block';
            document.getElementById('teacherPassword').value = '';
            document.getElementById('teacherPassword').focus();
            document.getElementById('passwordError').style.display = 'none';
        },

        checkTeacherPassword: function() {
            const password = document.getElementById('teacherPassword').value;
            if (password === TEACHER_PASSWORD) {
                this.setViewMode('teacher');
            } else {
                document.getElementById('passwordError').style.display = 'block';
                document.getElementById('teacherPassword').value = '';
                document.getElementById('teacherPassword').focus();
            }
        },

        togglePasswordVisibility: function() {
            const passwordInput = document.getElementById('teacherPassword');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
        },
    
    // 发送到服务器保存
    fetch('save.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(weekData)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert(`第${currentWeek}周课程表已保存！`);
        } else {
            alert('保存失败: ' + (data.error || '未知错误'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('保存失败，请检查网络连接');
    });
},

loadTimetable: function() {
    // 先从服务器加载
    fetch(`data/week_${currentWeek}.json`)
    .then(response => {
        if(!response.ok) throw new Error('未找到数据');
        return response.json();
    })
    .then(weekData => {
        timetableData = timetableData.filter(course => course.week !== currentWeek);
        timetableData = [...timetableData, ...(weekData.courses || [])];
        this.renderTimetable();
    })
    .catch(error => {
        console.log('从服务器加载失败，尝试从本地加载:', error);
        // 如果服务器加载失败，尝试从本地加载
        const savedData = localStorage.getItem(`classTimetable_week${currentWeek}`);
        if (savedData) {
            const weekData = JSON.parse(savedData);
            timetableData = timetableData.filter(course => course.week !== currentWeek);
            timetableData = [...timetableData, ...(weekData.courses || [])];
        }
        this.renderTimetable();
    });
},
        showAddCourseModal: function() {
            selectedCell = null;
            selectedCourseId = null;
            document.getElementById('modalTitle').textContent = '添加课程';
            document.getElementById('modalCourseName').value = '';
            document.getElementById('modalTeacher').value = '';
            document.getElementById('modalClassroom').value = '';
            document.getElementById('modalColor').value = '#4CAF50';
            document.getElementById('deleteCourseBtn').style.display = 'none';
            document.getElementById('courseModal').style.display = 'flex';
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
                this.loadTimetable();
            }
        },

        nextWeek: function() {
            if (currentWeek < MAX_WEEKS) {
                currentWeek++;
                this.updateWeekDisplay();
                this.loadTimetable();
            }
        },

        updateWeekDisplay: function() {
            document.getElementById('currentWeekDisplay').textContent = `第${currentWeek}周`;
        }
    };
})();
