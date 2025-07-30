document.addEventListener('DOMContentLoaded', () => {
    // Selectors for DOM elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const priorityInput = document.getElementById('priority-input');
    const taskList = document.getElementById('task-list');

    // Load tasks from localStorage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // --- Function to save tasks to localStorage ---
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // --- Function to render tasks to the DOM ---
    const renderTasks = () => {
        // Clear the current list
        taskList.innerHTML = '';

        // If there are no tasks, show a message
        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; color: #888;">No tasks yet. Add one above!</p>';
            return;
        }

        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.priority = task.priority; // For CSS styling
            if (task.completed) {
                taskItem.classList.add('completed');
            }

            // Structure of each task item
            taskItem.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            
            // Add click event to the task text itself to mark as complete
            taskItem.querySelector('.task-text').addEventListener('click', () => {
                toggleComplete(index);
            });

            taskList.appendChild(taskItem);
        });
    };

    // --- Function to add a new task ---
    const addTask = (text, priority) => {
        if (text.trim() === '') {
            alert('Task cannot be empty!');
            return;
        }

        tasks.push({ text, priority, completed: false });
        saveTasks();
        renderTasks();
    };
    
    // --- Function to delete a task ---
    const deleteTask = (index) => {
        // Confirmation before deleting
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    };

    // --- Function to edit a task ---
    const editTask = (index) => {
        const newText = prompt('Edit your task:', tasks[index].text);
        if (newText !== null && newText.trim() !== '') {
            tasks[index].text = newText.trim();
            saveTasks();
            renderTasks();
        }
    };
    
    // --- Function to toggle task completion ---
    const toggleComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    // --- Event Listener for form submission ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page refresh
        addTask(taskInput.value, priorityInput.value);
        taskInput.value = ''; // Clear the input field
    });

    // --- Event Listener for clicks on the task list (for Edit/Delete) ---
    // Using event delegation for efficiency
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            deleteTask(index);
        }

        if (e.target.classList.contains('edit-btn')) {
            const index = e.target.dataset.index;
            editTask(index);
        }
    });

    // --- Initial Render ---
    // Render tasks when the page first loads
    renderTasks();
});
