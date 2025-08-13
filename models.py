from datetime import datetime
from typing import Dict, List, Optional

class Task:
    """Task model for in-memory storage"""
    
    def __init__(self, id: int, title: str, description: str = "", completed: bool = False):
        self.id = id
        self.title = title
        self.description = description
        self.completed = completed
        self.created_at = datetime.utcnow().isoformat()
        self.updated_at = datetime.utcnow().isoformat()
    
    def to_dict(self) -> Dict:
        """Convert task to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    def update(self, title: Optional[str] = None, description: Optional[str] = None, 
               completed: Optional[bool] = None):
        """Update task fields and timestamp"""
        if title is not None:
            self.title = title
        if description is not None:
            self.description = description
        if completed is not None:
            self.completed = completed
        self.updated_at = datetime.utcnow().isoformat()

class TaskManager:
    """In-memory task storage and management"""
    
    def __init__(self):
        self.tasks: Dict[int, Task] = {}
        self.next_id = 1
    
    def create_task(self, title: str, description: str = "") -> Task:
        """Create a new task"""
        task = Task(self.next_id, title, description)
        self.tasks[self.next_id] = task
        self.next_id += 1
        return task
    
    def get_task(self, task_id: int) -> Optional[Task]:
        """Get task by ID"""
        return self.tasks.get(task_id)
    
    def get_all_tasks(self) -> List[Task]:
        """Get all tasks"""
        return list(self.tasks.values())
    
    def update_task(self, task_id: int, title: Optional[str] = None, 
                   description: Optional[str] = None, completed: Optional[bool] = None) -> Optional[Task]:
        """Update task by ID"""
        task = self.tasks.get(task_id)
        if task:
            task.update(title, description, completed)
        return task
    
    def delete_task(self, task_id: int) -> bool:
        """Delete task by ID"""
        if task_id in self.tasks:
            del self.tasks[task_id]
            return True
        return False

# Global task manager instance
task_manager = TaskManager()
