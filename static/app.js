// API base URL
const API_BASE = '/api';

// DOM elements
const createTaskForm = document.getElementById('createTaskForm');
const editTaskForm = document.getElementById('editTaskForm');
const tasksContainer = document.getElementById('tasksContainer');
const responseLog = document.getElementById('responseLog');
const editModal = new bootstrap.Modal(document.getElementById('editTaskModal'));

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    
    // Set up form handlers
    createTaskForm.addEventListener('submit', handleCreateTask);
    editTaskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateTask();
    });
});

// Utility functions
function logResponse(method, url, response, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
        timestamp,
        method,
        url,
        status: response.status,
        data: data
    };
    
    const logText = `[${timestamp}] ${method} ${url} - ${response.status}\n${JSON.stringify(data, null, 2)}\n\n`;
    responseLog.textContent += logText;
    responseLog.scrollTop = responseLog.scrollHeight;
}

function clearLog() {
    responseLog.textContent = '';
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.container').insertBefore(alertDiv, document.querySelector('.card'));
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// API functions
async function apiRequest(method, url, data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE}${url}`, options);
        const responseData = await response.json();
        
        logResponse(method, url, response, responseData);
        
        return { response, data: responseData };
    } catch (error) {
        const errorData = { error: error.message };
        logResponse(method, url, { status: 'ERROR' }, errorData);
        throw error;
    }
}

// Task management functions
async function loadTasks() {
    try {
        const { response, data } = await apiRequest('GET', '/tasks');
        
        if (data.success) {
            renderTasks(data.data);
        } else {
            showAlert('Failed to load tasks: ' + data.error, 'danger');
        }
    } catch (error) {
        showAlert('Error loading tasks: ' + error.message, 'danger');
    }
}

async function handleCreateTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    
    if (!title) {
        showAlert('Title is required', 'warning');
        return;
    }
    
    try {
        const { response, data } = await apiRequest('POST', '/tasks', {
            title,
            description
        });
        
        if (data.success) {
            showAlert('Task created successfully!', 'success');
            createTaskForm.reset();
            loadTasks();
        } else {
            const errorMsg = data.details ? data.details.join(', ') : data.error;
            showAlert('Failed to create task: ' + errorMsg, 'danger');
        }
    } catch (error) {
        showAlert('Error creating task: ' + error.message, 'danger');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const { response, data } = await apiRequest('DELETE', `/tasks/${taskId}`);
        
        if (data.success) {
            showAlert('Task deleted successfully!', 'success');
            loadTasks();
        } else {
            showAlert('Failed to delete task: ' + data.error, 'danger');
        }
    } catch (error) {
        showAlert('Error deleting task: ' + error.message, 'danger');
    }
}

async function toggleTask(taskId) {
    try {
        const { response, data } = await apiRequest('PATCH', `/tasks/${taskId}/toggle`);
        
        if (data.success) {
            showAlert(data.message, 'success');
            loadTasks();
        } else {
            showAlert('Failed to toggle task: ' + data.error, 'danger');
        }
    } catch (error) {
        showAlert('Error toggling task: ' + error.message, 'danger');
    }
}

function editTask(task) {
    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskDescription').value = task.description;
    document.getElementById('editTaskCompleted').checked = task.completed;
    
    editModal.show();
}

async function updateTask() {
    const taskId = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTaskTitle').value.trim();
    const description = document.getElementById('editTaskDescription').value.trim();
    const completed = document.getElementById('editTaskCompleted').checked;
    
    if (!title) {
        showAlert('Title is required', 'warning');
        return;
    }
    
    try {
        const { response, data } = await apiRequest('PUT', `/tasks/${taskId}`, {
            title,
            description,
            completed
        });
        
        if (data.success) {
            showAlert('Task updated successfully!', 'success');
            editModal.hide();
            loadTasks();
        } else {
            const errorMsg = data.details ? data.details.join(', ') : data.error;
            showAlert('Failed to update task: ' + errorMsg, 'danger');
        }
    } catch (error) {
        showAlert('Error updating task: ' + error.message, 'danger');
    }
}

// Render functions
function renderTasks(tasks) {
    if (!tasks || tasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-inbox fa-2x mb-2"></i>
                <p>No tasks found. Create a new task to get started.</p>
            </div>
        `;
        return;
    }
    
    const tasksHtml = tasks.map(task => `
        <div class="card mb-3 ${task.completed ? 'border-success' : ''}">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6 class="card-title mb-1 ${task.completed ? 'text-decoration-line-through text-success' : ''}">
                            ${escapeHtml(task.title)}
                            ${task.completed ? '<i class="fas fa-check-circle text-success ms-2"></i>' : ''}
                        </h6>
                        ${task.description ? `<p class="card-text text-muted small mb-1">${escapeHtml(task.description)}</p>` : ''}
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i>
                            Created: ${new Date(task.created_at).toLocaleString()}
                            ${task.updated_at !== task.created_at ? `<br><i class="fas fa-edit me-1"></i>Updated: ${new Date(task.updated_at).toLocaleString()}` : ''}
                        </small>
                    </div>
                    <div class="col-md-4 text-end">
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm ${task.completed ? 'btn-outline-warning' : 'btn-outline-success'}" 
                                    onclick="toggleTask(${task.id})" 
                                    title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                                <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-primary" 
                                    onclick="editTask(${JSON.stringify(task).replace(/"/g, '&quot;')})" 
                                    title="Edit task">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="deleteTask(${task.id})" 
                                    title="Delete task">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    tasksContainer.innerHTML = tasksHtml;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
