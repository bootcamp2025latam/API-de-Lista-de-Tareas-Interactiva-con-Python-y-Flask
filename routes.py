from flask import request, jsonify, render_template
from app import app
from models import todo_manager

def validate_todo_data(data, required_fields=None):
    """Validate todo data and return errors if any"""
    if not data:
        return ["Request body must contain JSON data"]
    
    errors = []
    
    if required_fields:
        for field in required_fields:
            if field not in data or data[field] is None:
                errors.append(f"'{field}' is required")
            elif field == 'label' and isinstance(data[field], str) and not data[field].strip():
                errors.append("'label' cannot be empty")
    
    # Validate label if present
    if 'label' in data and data['label'] is not None:
        if not isinstance(data['label'], str):
            errors.append("'label' must be a string")
        elif len(data['label'].strip()) > 200:
            errors.append("'label' must be 200 characters or less")
    
    # Validate done if present
    if 'done' in data and data['done'] is not None:
        if not isinstance(data['done'], bool):
            errors.append("'done' must be a boolean")
    
    return errors

@app.route('/')
def index():
    """Serve the main HTML page for testing the API"""
    return render_template('index.html')

@app.route('/todos', methods=['GET'])
def get_todos():
    """Get all todos"""
    try:
        todos = todo_manager.get_all_todos()
        return jsonify([todo.to_dict() for todo in todos]), 200
    except Exception as e:
        app.logger.error(f"Error getting todos: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/todos', methods=['POST'])
def create_todo():
    """Create a new todo"""
    try:
        data = request.get_json()
        
        # Validate required fields
        errors = validate_todo_data(data, required_fields=['label'])
        if errors:
            return jsonify({'error': 'Validation failed', 'details': errors}), 400
        
        # Create todo and get updated list
        updated_todos = todo_manager.create_todo(
            label=data['label'].strip(),
            done=data.get('done', False)
        )
        
        return jsonify([todo.to_dict() for todo in updated_todos]), 200
        
    except Exception as e:
        app.logger.error(f"Error creating todo: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/todos/<int:position>', methods=['DELETE'])
def delete_todo(position):
    """Delete a todo by position"""
    try:
        updated_todos = todo_manager.delete_todo(position)
        return jsonify([todo.to_dict() for todo in updated_todos]), 200
        
    except Exception as e:
        app.logger.error(f"Error deleting todo at position {position}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

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
