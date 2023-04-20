import { tasksList } from "./TasksList.js";

class UI {
  initialTasks(tasks) {
    const tasksContainer = document.getElementById("tasks-list");
    tasks.forEach((task) => {
      const taskElement = this.createNewTaskElement(task);
      tasksContainer.insertBefore(taskElement, tasksContainer.lastElementChild);
    });
  }

  // add a new task to the Tasks List (on TasksList instance and on DOM)
  addTask() {
    const taskInputElement = document.getElementById("task-input");
    const taskDescription = taskInputElement.value;

    if (taskDescription) {
      // create the task object and add it to the tasks list instance
      const id = tasksList.getMaxTaskId() + 1;
      const newTask = { id: id, value: taskDescription, done: false };
      tasksList.addTask(newTask);

      //add the task to DOM
      const tasksContainer = document.getElementById("tasks-list");
      const newTaskElement = this.createNewTaskElement(newTask);
      tasksContainer.insertBefore(
        newTaskElement,
        tasksContainer.lastElementChild
      );

      //reset the task input on DOM
      taskInputElement.value = "";

      //update local storage
      localStorage.setItem("tasks", JSON.stringify(tasksList.getTasks()));
    } else {
      alert("You must provide a task description");
    }
  }

  // check/uncheck task on the tasksList instance and on the DOM
  taskChecked(taskElement) {
    // get the task object from the tasksList instance
    const task = tasksList.getTask(taskElement.id);

    // if the task is marked as done - uncheck it, otherwise - check it
    const textDecoration = task.done ? "" : "line-through";

    tasksList.updateTask({ ...task, done: !task.done }); // update tasksList instance
    taskElement.style.textDecoration = textDecoration; // update task element on DOM

    //update local storage
    localStorage.setItem("tasks", JSON.stringify(tasksList.getTasks()));
  }

  deleteTask(taskElement) {
    // remove the task object from the tasksList instance
    tasksList.deleteTask(taskElement.id);

    // remove task from DOM with a fall animation
    taskElement.addEventListener("transitionend", function () {
      taskElement.remove();
    });
    taskElement.classList.add("tasks-list-item-fall");

    //update local storage
    localStorage.setItem("tasks", JSON.stringify(tasksList.getTasks()));
  }

  clearAllTasks() {
    // clear all tasks from the tasksList instance
    tasksList.setTasks([]);

    // clear all tasks from the DOM (leave only the "clear all" button)
    document.getElementById("tasks-list").innerHTML =
      '<span class="clear-all-text" onclick="clearAllTasks()">Clear All</span>';

    //update local storage
    localStorage.setItem("tasks", JSON.stringify(tasksList.getTasks()));
  }

  createNewTaskElement(newTask) {
    var task = document.createElement("div");
    task.id = newTask.id;
    task.className = "list-item";
    task.style.textDecoration = newTask.done ? "line-through" : "";
    task.innerHTML = `
                  <i class="fas fa-check-square check-icon"></i>
                  <i class="fas fa-trash-alt delete-icon"></i>
                  <li class="list-item-text">${newTask.value}</li>
          `;
    return task;
  }
}

export const ui = new UI();
