class TasksList {
  constructor(initialTasks) {
    this.tasks = initialTasks;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  updateTask(updatedTask) {
    this.tasks = this.tasks.map((task) =>
      task.id == updatedTask.id ? updatedTask : task
    );
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id != taskId);
  }

  getTask(id) {
    return this.tasks.find((task) => task.id == id);
  }

  getTasks() {
    return this.tasks;
  }

  setTasks(tasks) {
    this.tasks = tasks;
  }

  getMaxTaskId() {
    let maxId = 0;
    this.tasks.length > 0
      ? this.tasks.forEach((task) => {
          if (task.id > maxId) maxId = task.id;
        })
      : null;
    return maxId;
  }
}

export const tasksList = new TasksList();
