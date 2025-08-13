// DOM elements
const createTodoForm = document.getElementById('createTodoForm');
const todosContainer = document.getElementById('tasksContainer');
const responseLog = document.getElementById('responseLog');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTodos();
    
    // Set up form handlers
    createTodoForm.addEventListener('submit', handleCreateTodo);
});

// Utility functions
function logResponse(method, url, response, data = null) {
    const timestamp = new Date().toLocaleTimeString();
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
        const response = await fetch(url, options);
        const responseData = await response.json();
        
        logResponse(method, url, response, responseData);
        
        return { response, data: responseData };
    } catch (error) {
        const errorData = { error: error.message };
        logResponse(method, url, { status: 'ERROR' }, errorData);
        throw error;
    }
}

// Todo management functions
async function loadTodos() {
    try {
        const { response, data } = await apiRequest('GET', '/todos');
        
        if (response.ok) {
            renderTodos(data);
        } else {
            showAlert('Error al cargar las tareas: ' + (data.error || 'Error desconocido'), 'danger');
        }
    } catch (error) {
        showAlert('Error al cargar las tareas: ' + error.message, 'danger');
    }
}

async function handleCreateTodo(e) {
    e.preventDefault();
    
    const label = document.getElementById('todoLabel').value.trim();
    const done = document.getElementById('todoDone').checked;
    
    if (!label) {
        showAlert('La etiqueta es requerida', 'warning');
        return;
    }
    
    try {
        const { response, data } = await apiRequest('POST', '/todos', {
            label,
            done
        });
        
        if (response.ok) {
            showAlert('¡Tarea creada exitosamente!', 'success');
            createTodoForm.reset();
            renderTodos(data);
        } else {
            const errorMsg = data.details ? data.details.join(', ') : data.error;
            showAlert('Error al crear la tarea: ' + errorMsg, 'danger');
        }
    } catch (error) {
        showAlert('Error al crear la tarea: ' + error.message, 'danger');
    }
}

async function deleteTodo(position) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }
    
    try {
        const { response, data } = await apiRequest('DELETE', `/todos/${position}`);
        
        if (response.ok) {
            showAlert('¡Tarea eliminada exitosamente!', 'success');
            renderTodos(data);
        } else {
            showAlert('Error al eliminar la tarea: ' + (data.error || 'Error desconocido'), 'danger');
        }
    } catch (error) {
        showAlert('Error al eliminar la tarea: ' + error.message, 'danger');
    }
}

// Render functions
function renderTodos(todos) {
    if (!todos || todos.length === 0) {
        todosContainer.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-inbox fa-2x mb-2"></i>
                <p>No hay tareas. Crea una nueva tarea para comenzar.</p>
            </div>
        `;
        return;
    }
    
    const todosHtml = todos.map((todo, index) => `
        <div class="card mb-3 ${todo.done ? 'border-success' : ''}">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6 class="card-title mb-1 ${todo.done ? 'text-decoration-line-through text-success' : ''}">
                            ${escapeHtml(todo.label)}
                            ${todo.done ? '<i class="fas fa-check-circle text-success ms-2"></i>' : ''}
                        </h6>
                        <small class="text-muted">
                            <i class="fas fa-list-ol me-1"></i>
                            Posición: ${index}
                        </small>
                    </div>
                    <div class="col-md-4 text-end">
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="deleteTodo(${index})" 
                                    title="Eliminar tarea">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    todosContainer.innerHTML = todosHtml;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}