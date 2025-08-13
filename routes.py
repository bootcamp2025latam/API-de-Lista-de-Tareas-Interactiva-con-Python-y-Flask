from flask import request, jsonify, render_template
from app import app
from models import task_manager

def validate_task_data(data, required_fields=None):
    """Validate task data and return errors if any"""
    if not data:
        return ["Request body must contain JSON data"]
    
    errors = []
    
    if required_fields:
        for field in required_fields:
            if field not in data or data[field] is None:
                errors.append(f"'{field}' is required")
            elif field == 'title' and isinstance(data[field], str) and not data[field].strip():
                errors.append("'title' cannot be empty")
    
    # Validate title if present
    if 'title' in data and data['title'] is not None:
        if not isinstance(data['title'], str):
            errors.append("'title' must be a string")
        elif len(data['title'].strip()) > 200:
            errors.append("'title' must be 200 characters or less")
    
    # Validate description if present
    if 'description' in data and data['description'] is not None:
        if not isinstance(data['description'], str):
            errors.append("'description' must be a string")
        elif len(data['description']) > 1000:
            errors.append("'description' must be 1000 characters or less")
    
    # Validate completed if present
    if 'completed' in data and data['completed'] is not None:
        if not isinstance(data['completed'], bool):
            errors.append("'completed' must be a boolean")
    
    return errors

@app.route('/')
def index():
    """Serve the main HTML page for testing the API"""
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    try:
        tasks = task_manager.get_all_tasks()
        return jsonify({
            'success': True,
            'data': [task.to_dict() for task in tasks],
            'count': len(tasks)
        }), 200
    except Exception as e:
        app.logger.error(f"Error getting tasks: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Get a specific task by ID"""
    try:
        task = task_manager.get_task(task_id)
        if not task:
            return jsonify({
                'success': False,
                'error': f'Task with ID {task_id} not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': task.to_dict()
        }), 200
    except Exception as e:
        app.logger.error(f"Error getting task {task_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task"""
    try:
        data = request.get_json()
        
        # Validate required fields
        errors = validate_task_data(data, required_fields=['title'])
        if errors:
            return jsonify({
                'success': False,
                'error': 'Validation failed',
                'details': errors
            }), 400
        
        # Create task
        task = task_manager.create_task(
            title=data['title'].strip(),
            description=data.get('description', '').strip()
        )
        
        return jsonify({
            'success': True,
            'data': task.to_dict(),
            'message': 'Task created successfully'
        }), 201
        
    except Exception as e:
        app.logger.error(f"Error creating task: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update an existing task"""
    try:
        # Check if task exists
        existing_task = task_manager.get_task(task_id)
        if not existing_task:
            return jsonify({
                'success': False,
                'error': f'Task with ID {task_id} not found'
            }), 404
        
        data = request.get_json()
        
        # Validate data
        errors = validate_task_data(data)
        if errors:
            return jsonify({
                'success': False,
                'error': 'Validation failed',
                'details': errors
            }), 400
        
        # Update task
        title = data.get('title')
        if title is not None:
            title = title.strip()
            if not title:
                return jsonify({
                    'success': False,
                    'error': 'Validation failed',
                    'details': ["'title' cannot be empty"]
                }), 400
        
        description = data.get('description')
        if description is not None:
            description = description.strip()
        
        completed = data.get('completed')
        
        updated_task = task_manager.update_task(task_id, title, description, completed)
        
        if not updated_task:
            return jsonify({
                'success': False,
                'error': f'Task with ID {task_id} not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': updated_task.to_dict(),
            'message': 'Task updated successfully'
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error updating task {task_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    try:
        success = task_manager.delete_task(task_id)
        if not success:
            return jsonify({
                'success': False,
                'error': f'Task with ID {task_id} not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': f'Task {task_id} deleted successfully'
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error deleting task {task_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/tasks/<int:task_id>/toggle', methods=['PATCH'])
def toggle_task_completion(task_id):
    """Toggle task completion status"""
    try:
        task = task_manager.get_task(task_id)
        if not task:
            return jsonify({
                'success': False,
                'error': f'Task with ID {task_id} not found'
            }), 404
        
        updated_task = task_manager.update_task(task_id, completed=not task.completed)
        
        if not updated_task:
            return jsonify({
                'success': False,
                'error': f'Task with ID {task_id} not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': updated_task.to_dict(),
            'message': f'Task marked as {"completed" if updated_task.completed else "incomplete"}'
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error toggling task {task_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'success': False,
        'error': 'Method not allowed'
    }), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500
