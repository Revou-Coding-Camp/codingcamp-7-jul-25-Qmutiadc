document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const taskList = document.getElementById('task-list');
    const showAllBtn = document.getElementById('show-all');
    const showCompletedBtn = document.getElementById('show-completed');
    const deleteAllBtn = document.getElementById('delete-all');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render tasks
    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<li class="text-center text-gray-500 py-4">No tasks yet. Add one above!</li>';
            return;
        }

        let filteredTasks = tasks;
        if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item bg-gray-50 rounded p-3 flex items-center justify-between';
            taskItem.innerHTML = `
                <div class="flex items-center">
                    <input 
                        type="checkbox" 
                        class="task-checkbox h-5 w-5 mr-3" 
                        ${task.completed ? 'checked' : ''}
                        data-index="${index}">
                    <span class="task-text ${task.completed ? 'line-through text-gray-400' : ''}">
                        ${task.text}
                    </span>
                </div>
                <div class="flex items-center">
                    <span class="text-sm text-gray-500 mr-3">${task.date || 'No date'}</span>
                    <button 
                        class="delete-btn text-red-500 hover:text-red-700" 
                        data-index="${index}">
                        ×
                    </button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });

        // Add event listeners to new elements
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTask);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }

    // Add new task
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!taskInput.value.trim()) {
            alert('Please enter a task!');
            return;
        }

        const newTask = {
            text: taskInput.value.trim(),
            date: dateInput.value,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        // Reset form
        taskInput.value = '';
        dateInput.value = '';
        taskInput.focus();
    });

    // Toggle task completion
    function toggleTask(e) {
        const index = e.target.dataset.index;
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks(getCurrentFilter());
    }

    // Delete single task
    function deleteTask(e) {
        const index = e.target.dataset.index;
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(getCurrentFilter());
    }

    // Delete all tasks
    deleteAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });

    // Filter tasks
    showAllBtn.addEventListener('click', function() {
        setActiveFilter('all');
        renderTasks('all');
    });

    showCompletedBtn.addEventListener('click', function() {
        setActiveFilter('completed');
        renderTasks('completed');
    });

    // Helper functions
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function setActiveFilter(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200');
        });

        const activeBtn = filter === 'all' ? showAllBtn : showCompletedBtn;
        activeBtn.classList.add('active', 'bg-blue-500', 'text-white');
        activeBtn.classList.remove('bg-gray-200');
    }

    function getCurrentFilter() {
        return showAllBtn.classList.contains('active') ? 'all' : 'completed';
    }

    // Initial render
    renderTasks();
});