import asyncio
import uuid
from typing import Any, Dict, List, Callable, Awaitable, Union
from datetime import datetime
import logging
from enum import Enum

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TaskStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TaskResult:
    """
    Represents the result of a completed task
    """
    def __init__(self, task_id: str, result: Any = None, error: Exception = None, status: TaskStatus = TaskStatus.COMPLETED):
        self.task_id = task_id
        self.result = result
        self.error = error
        self.status = status
        self.completed_at = datetime.now()

class Task:
    """
    Represents a single task that can be executed by the TaskRunner
    """
    def __init__(self, task_id: str, name: str, func: Callable, *args, **kwargs):
        self.task_id = task_id
        self.name = name
        self.func = func
        self.args = args
        self.kwargs = kwargs
        self.status = TaskStatus.PENDING
        self.created_at = datetime.now()
        self.started_at = None
        self.completed_at = None

    async def execute(self) -> TaskResult:
        """
        Execute the task and return the result
        """
        self.status = TaskStatus.RUNNING
        self.started_at = datetime.now()

        try:
            logger.info(f"Executing task '{self.name}' (ID: {self.task_id})")

            # Check if the function is async or sync
            if asyncio.iscoroutinefunction(self.func):
                result = await self.func(*self.args, **self.kwargs)
            else:
                result = self.func(*self.args, **self.kwargs)

            self.status = TaskStatus.COMPLETED
            self.completed_at = datetime.now()

            logger.info(f"Task '{self.name}' completed successfully")
            return TaskResult(self.task_id, result=result, status=self.status)

        except Exception as e:
            self.status = TaskStatus.FAILED
            self.completed_at = datetime.now()

            logger.error(f"Task '{self.name}' failed: {str(e)}")
            return TaskResult(self.task_id, error=e, status=self.status)

class TaskRunner:
    """
    Centralized task runner for executing intelligent tasks
    """
    def __init__(self):
        self.tasks: Dict[str, Task] = {}
        self.running_tasks: Dict[str, asyncio.Task] = {}
        self.results: Dict[str, TaskResult] = {}
        self.max_concurrent_tasks = 10  # Limit concurrent tasks

    def register_task(self, name: str, func: Callable) -> str:
        """
        Register a new task function
        """
        task_id = str(uuid.uuid4())
        logger.info(f"Registered task '{name}' with ID: {task_id}")
        return task_id

    async def run_task(self, name: str, func: Callable, *args, **kwargs) -> TaskResult:
        """
        Run a single task and return the result
        """
        task_id = self.register_task(name, func)
        task = Task(task_id, name, func, *args, **kwargs)
        self.tasks[task_id] = task

        result = await task.execute()
        self.results[task_id] = result

        return result

    async def run_tasks_concurrent(self, tasks_config: List[Dict[str, Any]]) -> List[TaskResult]:
        """
        Run multiple tasks concurrently
        """
        semaphore = asyncio.Semaphore(self.max_concurrent_tasks)

        async def limited_run(task_config: Dict[str, Any]) -> TaskResult:
            async with semaphore:
                name = task_config['name']
                func = task_config['func']
                args = task_config.get('args', [])
                kwargs = task_config.get('kwargs', {})

                return await self.run_task(name, func, *args, **kwargs)

        # Create tasks for concurrent execution
        coroutines = [limited_run(config) for config in tasks_config]
        results = await asyncio.gather(*coroutines, return_exceptions=True)

        # Handle any exceptions that occurred during execution
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                task_id = str(uuid.uuid4())  # Generate a new ID for the failed task
                error_result = TaskResult(task_id, error=result, status=TaskStatus.FAILED)
                processed_results.append(error_result)
            else:
                processed_results.append(result)

        return processed_results

    def get_task_status(self, task_id: str) -> TaskStatus:
        """
        Get the status of a specific task
        """
        if task_id in self.tasks:
            return self.tasks[task_id].status
        elif task_id in self.results:
            return self.results[task_id].status
        else:
            raise ValueError(f"Task with ID {task_id} not found")

    def get_task_result(self, task_id: str) -> TaskResult:
        """
        Get the result of a completed task
        """
        if task_id in self.results:
            return self.results[task_id]
        else:
            raise ValueError(f"Result for task with ID {task_id} not found")

    def cancel_task(self, task_id: str) -> bool:
        """
        Cancel a running task
        """
        if task_id in self.running_tasks:
            task = self.running_tasks[task_id]
            task.cancel()
            return True
        return False

    def get_all_tasks(self) -> List[Dict[str, Any]]:
        """
        Get information about all tasks
        """
        task_info = []
        for task_id, task in self.tasks.items():
            result = self.results.get(task_id)
            task_info.append({
                'task_id': task.task_id,
                'name': task.name,
                'status': task.status.value,
                'created_at': task.created_at,
                'started_at': task.started_at,
                'completed_at': task.completed_at,
                'has_result': result is not None
            })
        return task_info

# Global task runner instance
task_runner = TaskRunner()