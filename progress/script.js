document.addEventListener("DOMContentLoaded", loadTasks);

/**
 * Loads tasks from localStorage, ensures all tasks have IDs, and displays them
 * If no tasks exist in localStorage, initializes with empty hovedopgaver array
 * @returns {void}
 */
function loadTasks() {
    const data = JSON.parse(localStorage.getItem('tasks') || '{"hovedopgaver": []}');
    ensureTaskIds(data.hovedopgaver);
    displayTasks(data);
}

/**
 * Generates a unique ID by combining current timestamp with random string
 * @returns {string} A unique ID in format 'timestamp-randomstring'
 */
function generateId() {
    return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Ensures all tasks have unique IDs
 * @param {Array} tasks - Array of tasks to ensure IDs for
 * @returns {void}
 */
function ensureTaskIds(tasks) {
    tasks.forEach(task => {
        if (!task.id) {
            task.id = generateId();
        }
        if (task.subopgavers && task.subopgavers.length > 0) {
            ensureTaskIds(task.subopgavers);
        }
    });
}

/**
 * Creates a task element for display in the task list
 * @param {Object} task - The task object to create an element for
 * @param {boolean} isSubtask - Whether the task is a subtask
 * @param {Object} parentTask - The parent task object (only used if isSubtask is true)
 * @returns {HTMLElement} The created task element
 */
function createTaskElement(task, isSubtask = false, parentTask = null) {
    const taskElement = document.createElement("li");
    taskElement.classList.add(isSubtask ? "subtask" : "main-task");
    taskElement.dataset.taskId = task.id;

    // Create and append header components
    const taskHeader = createTaskHeader(task, taskElement, isSubtask, parentTask);
    taskElement.appendChild(taskHeader);

    // Create and append progress bar
    const progressContainer = createProgressContainer();
    taskElement.appendChild(progressContainer);

    // Create and append content container
    const taskContent = createTaskContent(task, isSubtask, parentTask);
    taskElement.appendChild(taskContent);

    // Initialize collapse state
    initializeCollapseState(taskElement, task);

    // Initialize progress
    updateProgress(taskElement, task);

    return taskElement;
}

/**
 * Creates the header for a task, including collapse button, checkbox, title, and button container
 * @param {Object} task - The task object to create a header for
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {boolean} isSubtask - Whether the task is a subtask
 * @param {Object} parentTask - The parent task object (only used if isSubtask is true)
 * @returns {HTMLElement} The created task header element
 */
function createTaskHeader(task, taskElement, isSubtask, parentTask) {
    const taskHeader = document.createElement("div");
    taskHeader.classList.add("task-header");

    const collapseButton = createCollapseButton(taskElement, task);
    const checkbox = createCheckbox(task, taskElement, isSubtask);
    const title = createTaskTitle(task);
    const buttonContainer = createButtonContainer(task, taskElement, isSubtask, parentTask);

    taskHeader.appendChild(collapseButton);
    taskHeader.appendChild(checkbox);
    taskHeader.appendChild(title);
    taskHeader.appendChild(buttonContainer);

    return taskHeader;
}

/**
 * Creates a collapse button for a task
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {Object} task - The task object to create a collapse button for
 * @returns {HTMLElement} The created collapse button element
 */
function createCollapseButton(taskElement, task) {
    const collapseButton = document.createElement("button");
    collapseButton.textContent = "▼";
    collapseButton.classList.add("collapse-button");
    collapseButton.title = "Collapse/Expand task";
    collapseButton.addEventListener("click", () => handleCollapse(taskElement, task, collapseButton));
    return collapseButton;
}

/**
 * Handles the collapse/expand action for a task
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {Object} task - The task object to handle collapse/expand for
 * @param {HTMLElement} collapseButton - The collapse button element
 * @returns {void}
 */
function handleCollapse(taskElement, task, collapseButton) {
    const description = taskElement.querySelector('.task-description');
    const subtasksList = taskElement.querySelector('.subtasks');
    const isCollapsed = subtasksList?.style.display === 'none' || 
                       (description && description.style.display === 'none');
    
    if (description) description.style.display = isCollapsed ? 'block' : 'none';
    if (subtasksList) subtasksList.style.display = isCollapsed ? 'block' : 'none';
    collapseButton.textContent = isCollapsed ? "▼" : "▶";
    
    const collapseStates = JSON.parse(localStorage.getItem('taskCollapseStates') || '{}');
    collapseStates[task.id] = !isCollapsed;
    localStorage.setItem('taskCollapseStates', JSON.stringify(collapseStates));
}

/**
 * Creates a checkbox for a task
 * @param {Object} task - The task object to create a checkbox for
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {boolean} isSubtask - Whether the task is a subtask
 * @returns {HTMLElement} The created checkbox element
 */
function createCheckbox(task, taskElement, isSubtask) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.isDone;
    checkbox.addEventListener("change", () => handleCheckboxChange(task, taskElement, checkbox, isSubtask));
    return checkbox;
}

/**
 * Creates a title for a task
 * @param {Object} task - The task object to create a title for
 * @returns {HTMLElement} The created title element
 */
function createTaskTitle(task) {
    const title = document.createElement("span");
    title.textContent = task.title;
    title.classList.add("task-title");
    return title;
}

/**
 * Creates a button container for a task, including add and delete buttons
 * @param {Object} task - The task object to create a button container for
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {boolean} isSubtask - Whether the task is a subtask
 * @param {Object} parentTask - The parent task object (only used if isSubtask is true)
 * @returns {HTMLElement} The created button container element
 */
function createButtonContainer(task, taskElement, isSubtask, parentTask) {
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("task-buttons");

    const addButton = createAddButton(task, taskElement);
    const deleteButton = createDeleteButton(task, taskElement, isSubtask, parentTask);

    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(deleteButton);
    return buttonContainer;
}

/**
 * Creates an add button for a task
 * @param {Object} task - The task object to create an add button for
 * @param {HTMLElement} taskElement - The parent element for the task
 * @returns {HTMLElement} The created add button element
 */
function createAddButton(task, taskElement) {
    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.classList.add("add-subtask");
    addButton.title = "Add subtask";
    addButton.addEventListener("click", () => handleAddSubtask(task, taskElement));
    return addButton;
}

/**
 * Creates a delete button for a task
 * @param {Object} task - The task object to create a delete button for
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {boolean} isSubtask - Whether the task is a subtask
 * @param {Object} parentTask - The parent task object (only used if isSubtask is true)
 * @returns {HTMLElement} The created delete button element
 */
function createDeleteButton(task, taskElement, isSubtask, parentTask) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "×";
    deleteButton.classList.add("delete-task");
    deleteButton.title = "Delete task";
    deleteButton.addEventListener("click", () => handleDeleteTask(task, taskElement, isSubtask, parentTask));
    return deleteButton;
}

/**
 * Creates a progress container for a task, including progress bar and progress text
 * @returns {HTMLElement} The created progress container element
 */
function createProgressContainer() {
    const progressContainer = document.createElement("div");
    progressContainer.classList.add("progress-container");
    
    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    
    const progressText = document.createElement("span");
    progressText.classList.add("progress-text");
    
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(progressText);
    return progressContainer;
}

/**
 * Creates the content for a task, including description and subtasks
 * @param {Object} task - The task object to create content for
 * @param {boolean} isSubtask - Whether the task is a subtask
 * @param {Object} parentTask - The parent task object (only used if isSubtask is true)
 * @returns {HTMLElement} The created task content element
 */
function createTaskContent(task, isSubtask, parentTask) {
    const taskContent = document.createElement("div");
    taskContent.classList.add("task-content");

    if (task.description) {
        const description = document.createElement("p");
        description.textContent = task.description;
        description.classList.add("task-description");
        taskContent.appendChild(description);
    }

    if (task.subopgavers && task.subopgavers.length > 0) {
        const subtasksList = createSubtasksList(taskContent);
        task.subopgavers.forEach(subtask => {
            const subtaskElement = createTaskElement(subtask, true, task);
            subtasksList.appendChild(subtaskElement);
        });
    }

    return taskContent;
}

/**
 * Initializes the collapse state for a task
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {Object} task - The task object to initialize collapse state for
 * @returns {void}
 */
function initializeCollapseState(taskElement, task) {
    const collapseStates = JSON.parse(localStorage.getItem('taskCollapseStates') || '{}');
    if (collapseStates[task.id]) {
        const description = taskElement.querySelector('.task-description');
        const subtasksList = taskElement.querySelector('.subtasks');
        if (description) description.style.display = 'none';
        if (subtasksList) subtasksList.style.display = 'none';
        const collapseButton = taskElement.querySelector('.collapse-button');
        if (collapseButton) collapseButton.textContent = "▶";
    }
}

/**
 * Creates a subtasks list for a task
 * @param {HTMLElement} taskElement - The parent element for the task
 * @returns {HTMLElement} The created subtasks list element
 */
function createSubtasksList(taskElement) {
    let subtasksList = taskElement.querySelector('.subtasks');
    if (!subtasksList) {
        subtasksList = document.createElement("ul");
        subtasksList.classList.add("subtasks");
        taskElement.appendChild(subtasksList);
    }
    return subtasksList;
}

/**
 * Updates the visual state of a task
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {Object} task - The task object to update visuals for
 * @returns {void}
 */
function updateTaskVisuals(taskElement, task) {
    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    const titleSpan = taskElement.querySelector('.task-title');
    
    checkbox.checked = task.isDone;
    if (task.isDone) {
        titleSpan.classList.add('completed');
    } else {
        titleSpan.classList.remove('completed');
    }
    
    // Update progress bar when task state changes
    updateProgress(taskElement, task);
}

/**
 * Updates a task in the data structure
 * @param {Object} data - The data structure containing tasks
 * @param {Object} taskToUpdate - The task object to update
 * @returns {boolean} Whether the task was updated successfully
 */
function updateTaskInData(data, taskToUpdate) {
    function updateTask(tasks) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === taskToUpdate.id) {
                tasks[i] = taskToUpdate;
                return true;
            }
            if (tasks[i].subopgavers && tasks[i].subopgavers.length > 0) {
                if (updateTask(tasks[i].subopgavers)) {
                    return true;
                }
            }
        }
        return false;
    }
    return updateTask(data.hovedopgaver);
}

/**
 * Displays tasks in the task list
 * @param {Object} data - The data structure containing tasks
 * @returns {void}
 */
function displayTasks(data) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    
    data.hovedopgaver.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

/**
 * Exports the current progress to a JSON file
 * @returns {void}
 */
function exportProgress() {
    const data = localStorage.getItem('tasks');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Imports progress from a JSON file
 * @param {Event} event - The event object
 * @returns {void}
 */
function importProgress(event) {
    if (!event || !event.target.files) {
        document.getElementById('importInput').click();
        return;
    }
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                ensureTaskIds(data.hovedopgaver); // Ensure imported tasks have IDs
                localStorage.setItem('tasks', JSON.stringify(data));
                displayTasks(data);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Error loading file. Please make sure it\'s a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
}

/**
 * Updates the progress bar and text for a task
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {Object} task - The task object to update progress for
 * @returns {void}
 */
function updateProgress(taskElement, task) {
    // Calculate the actual progress regardless of task completion state
    const { completed, total } = calculateProgress(task);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const progressBar = taskElement.querySelector('.progress-bar');
    const progressText = taskElement.querySelector('.progress-text');
    
    // If task is marked as done, show 100% progress but keep actual numbers
    if (task.isDone) {
        progressBar.style.width = '100%';
        progressBar.classList.add('complete');
        progressText.textContent = `${total}/${total} (100%)`;
        return;
    }

    progressBar.style.width = `${percentage}%`;
    progressBar.classList.remove('complete');
    progressText.textContent = `${completed}/${total} (${percentage}%)`;

    // Only auto-complete if this task has direct subtasks that are all complete
    if (task.subopgavers && task.subopgavers.length > 0) {
        const allSubtasksComplete = task.subopgavers.every(subtask => subtask.isDone);
        if (allSubtasksComplete && !task.isDone) {
            task.isDone = true;
            const checkbox = taskElement.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = true;
            const data = JSON.parse(localStorage.getItem('tasks'));
            updateTaskInData(data, task);
            localStorage.setItem('tasks', JSON.stringify(data));
            updateTaskVisuals(taskElement, task);
        }
    }
}

/**
 * Calculates the progress of a task, including subtasks
 * @param {Object} task - The task object to calculate progress for
 * @returns {Object} An object containing completed and total counts
 */
function calculateProgress(task) {
    if (!task.subopgavers || task.subopgavers.length === 0) {
        return { completed: task.isDone ? 1 : 0, total: 1 };
    }

    // Calculate progress of immediate subtasks
    return task.subopgavers.reduce((acc, subtask) => {
        const subtaskProgress = calculateProgress(subtask);
        return {
            completed: acc.completed + subtaskProgress.completed,
            total: acc.total + subtaskProgress.total
        };
    }, { completed: 0, total: 0 });
}

/**
 * Updates the progress of a parent task
 * @param {HTMLElement} parentElement - The parent element for the task
 * @param {Object} parentTask - The parent task object to update progress for
 * @returns {void}
 */
function updateParentProgress(parentElement, parentTask) {
    updateProgress(parentElement, parentTask);
    // Find the next parent if it exists
    const grandparentElement = parentElement.closest('.subtasks')?.closest('li');
    if (grandparentElement) {
        const data = JSON.parse(localStorage.getItem('tasks'));
        const grandparentTask = findTaskById(data, grandparentElement.dataset.taskId);
        if (grandparentTask) {
            updateParentProgress(grandparentElement, grandparentTask);
        }
    }
}

/**
 * Finds a task by its ID in the data structure
 * @param {Object} data - The data structure containing tasks
 * @param {string} taskId - The ID of the task to find
 * @returns {Object|null} The found task or null if not found
 */
function findTaskById(data, taskId) {
    function findTask(tasks) {
        for (const task of tasks) {
            if (task.id === taskId) {
                return task;
            }
            if (task.subopgavers && task.subopgavers.length > 0) {
                const found = findTask(task.subopgavers);
                if (found) return found;
            }
        }
        return null;
    }
    return findTask(data.hovedopgaver);
}

/**
 * Unchecks parent tasks when a subtask is unchecked
 * @param {HTMLElement} taskElement - The parent element for the task
 * @returns {void}
 */
function uncheckParentTasks(taskElement) {
    let currentElement = taskElement;
    while (currentElement) {
        const parentTaskElement = currentElement.closest('.subtasks')?.closest('li');
        if (!parentTaskElement) break;

        const parentCheckbox = parentTaskElement.querySelector('input[type="checkbox"]');
        if (parentCheckbox) {
            parentCheckbox.checked = false;
            
            // Update the data structure
            const parentTaskId = parentTaskElement.dataset.taskId;
            const data = JSON.parse(localStorage.getItem('tasks'));
            const parentTask = findTaskById(data, parentTaskId);
            if (parentTask) {
                parentTask.isDone = false;
                updateTaskInData(data, parentTask);
                localStorage.setItem('tasks', JSON.stringify(data));
                updateTaskVisuals(parentTaskElement, parentTask);
                updateProgress(parentTaskElement, parentTask);
            }
        }
        currentElement = parentTaskElement;
    }
}

/**
 * Updates the state of subtasks when a parent task is checked or unchecked
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {boolean} checked - Whether the parent task is checked
 * @returns {void}
 */
function updateSubtasksState(taskElement, checked) {
    const data = JSON.parse(localStorage.getItem('tasks'));
    const subtasks = taskElement.querySelectorAll('.subtasks input[type="checkbox"]');
    subtasks.forEach(subtaskCheckbox => {
        subtaskCheckbox.checked = checked;
        
        // Update the data structure for each subtask
        const subtaskElement = subtaskCheckbox.closest('li');
        const subtaskId = subtaskElement.dataset.taskId;
        const subtask = findTaskById(data, subtaskId);
        if (subtask) {
            subtask.isDone = checked;
            updateTaskInData(data, subtask);
            updateTaskVisuals(subtaskElement, subtask);
            updateProgress(subtaskElement, subtask);
        }
    });
    localStorage.setItem('tasks', JSON.stringify(data));
}

/**
 * Handles the change event for a checkbox
 * @param {Object} task - The task object to handle checkbox change for
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {HTMLElement} checkbox - The checkbox element
 * @param {boolean} isSubtask - Whether the task is a subtask
 * @returns {void}
 */
function handleCheckboxChange(task, taskElement, checkbox, isSubtask) {
    const data = JSON.parse(localStorage.getItem('tasks'));
    task.isDone = checkbox.checked;
    
    if (checkbox.checked) {
        updateSubtasksState(taskElement, true);
    } else {
        let currentElement = taskElement;
        while (currentElement) {
            const parentElement = currentElement.closest('.subtasks')?.closest('li');
            if (!parentElement) break;

            const parentId = parentElement.dataset.taskId;
            const parentTask = findTaskById(data, parentId);
            if (parentTask) {
                parentTask.isDone = false;
                const parentCheckbox = parentElement.querySelector('input[type="checkbox"]');
                if (parentCheckbox) {
                    parentCheckbox.checked = false;
                    const titleSpan = parentElement.querySelector('.task-title');
                    titleSpan.classList.remove('completed');
                }
                updateTaskInData(data, parentTask);
            }
            currentElement = parentElement;
        }
    }
    
    updateTaskInData(data, task);
    localStorage.setItem('tasks', JSON.stringify(data));
    
    updateTaskVisuals(taskElement, task);
    
    // Update progress for current task and all parents
    let currentElement = taskElement;
    while (currentElement) {
        const taskId = currentElement.dataset.taskId;
        const currentTask = findTaskById(data, taskId);
        if (currentTask) {
            updateProgress(currentElement, currentTask);
        }
        currentElement = currentElement.closest('.subtasks')?.closest('li');
    }
}

/**
 * Handles the addition of a subtask to a task
 * @param {Object} task - The parent task object to add a subtask to
 * @param {HTMLElement} taskElement - The parent element for the task
 * @returns {void}
 */
function handleAddSubtask(task, taskElement) {
    const newTitle = prompt("Enter subtask title:");
    if (newTitle) {
        const newDescription = prompt("Enter subtask description (optional):");
        const newSubtask = {
            id: generateId(),
            title: newTitle,
            description: newDescription,
            isDone: false,
            subopgavers: []
        };

        if (!task.subopgavers) {
            task.subopgavers = [];
        }
        task.subopgavers.push(newSubtask);
        
        const data = JSON.parse(localStorage.getItem('tasks'));
        updateTaskInData(data, task);
        localStorage.setItem('tasks', JSON.stringify(data));
        
        const subtasksList = taskElement.querySelector('.subtasks') || createSubtasksList(taskElement);
        const subtaskElement = createTaskElement(newSubtask, true, task);
        subtasksList.appendChild(subtaskElement);

        // Update progress for current task and all parents
        let currentElement = taskElement;
        while (currentElement) {
            const taskId = currentElement.dataset.taskId;
            const currentTask = findTaskById(data, taskId);
            if (currentTask) {
                updateProgress(currentElement, currentTask);
            }
            currentElement = currentElement.closest('.subtasks')?.closest('li');
        }
    }
}

/**
 * Handles the deletion of a task and its subtasks
 * @param {Object} task - The task object to delete
 * @param {HTMLElement} taskElement - The parent element for the task
 * @param {boolean} isSubtask - Whether the task is a subtask
 * @param {Object} parentTask - The parent task object (only used if isSubtask is true)
 * @returns {void}
 */
function handleDeleteTask(task, taskElement, isSubtask, parentTask) {
    if (confirm("Are you sure you want to delete this task and all its subtasks?")) {
        const data = JSON.parse(localStorage.getItem('tasks'));
        
        // Store parent elements before removing the task
        let parentElements = [];
        let currentElement = taskElement;
        while (currentElement) {
            const parentElement = currentElement.closest('.subtasks')?.closest('li');
            if (!parentElement) break;
            parentElements.push(parentElement);
            currentElement = parentElement;
        }

        // Remove task from data structure
        if (isSubtask && parentTask) {
            parentTask.subopgavers = parentTask.subopgavers.filter(t => t.id !== task.id);
            updateTaskInData(data, parentTask);
        } else {
            data.hovedopgaver = data.hovedopgaver.filter(t => t.id !== task.id);
        }
        localStorage.setItem('tasks', JSON.stringify(data));
        
        // Remove the task element
        taskElement.remove();

        // Update progress for all parent tasks
        parentElements.forEach(parentElement => {
            const parentId = parentElement.dataset.taskId;
            const parentTask = findTaskById(data, parentId);
            if (parentTask) {
                updateProgress(parentElement, parentTask);
            }
        });
    }
}