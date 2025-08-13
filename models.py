from typing import List, Optional

class Todo:
    """Todo model for in-memory storage"""
    
    def __init__(self, label: str, done: bool = False):
        self.label = label
        self.done = done
    
    def to_dict(self) -> dict:
        """Convert todo to dictionary for JSON serialization"""
        return {
            'done': self.done,
            'label': self.label
        }

class TodoManager:
    """In-memory todo storage and management"""
    
    def __init__(self):
        self.todos: List[Todo] = []
    
    def create_todo(self, label: str, done: bool = False) -> List[Todo]:
        """Create a new todo and return the updated list"""
        todo = Todo(label, done)
        self.todos.append(todo)
        return self.todos
    
    def get_all_todos(self) -> List[Todo]:
        """Get all todos"""
        return self.todos
    
    def delete_todo(self, position: int) -> List[Todo]:
        """Delete todo by position and return the updated list"""
        if 0 <= position < len(self.todos):
            del self.todos[position]
        return self.todos

# Global todo manager instance
todo_manager = TodoManager()
