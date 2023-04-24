import { ui } from "./modules/UI.js";
import { tasksList } from "./modules/TasksList.js";

//##################### Event Listeners #######################

// add task on enter key press
document
  .getElementById("task-input")
  .addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      ui.addTask();
    }
  });

// finish task / delete task event listeners
document.getElementById("tasks-list").addEventListener("click", (e) => {
  if (e.target.className == "fas fa-check-square check-icon")
    ui.taskChecked(e.target.parentNode);
  if (e.target.className == "fas fa-trash-alt delete-icon")
    ui.deleteTask(e.target.parentNode);
});

// add task
document
  .getElementById("add-task-button")
  .addEventListener("click", function () {
    ui.addTask();
  });

// clear all tasks
document.getElementById("clear-all").addEventListener("click", function () {
  ui.clearAllTasks();
});

const initiateTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  tasksList.setTasks(tasks);
  ui.initialTasks(tasks);
};

document.addEventListener("onload", initiateTasks());
