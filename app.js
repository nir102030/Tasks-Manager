class TasksList {
	constructor(initialTasks) {
		this.tasks = initialTasks;
	}

	addTask(task) {
		this.tasks.push(task);
	}

	updateTask(updatedTask) {
		this.tasks = this.tasks.map((task) => (task.id == updatedTask.id ? updatedTask : task));
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

class UI {
	initiateTasks(tasks) {
		const tasksContainer = document.getElementById("tasks-list");
		tasks.forEach((task) => {
			const taskElement = this.createNewTaskElement(task);
			tasksContainer.insertBefore(taskElement, tasksContainer.lastElementChild);
		});
	}

	// add a new task to the Tasks List (on TasksList instance and on DOM)
	addTask() {
		const taskInputElement = document.getElementById("new-task-input");
		const taskDescription = taskInputElement.value;
		if (taskDescription) {
			// create the task object and add it to the tasks list instance
			const id = tasksList.getMaxTaskId() + 1;
			const newTask = { id: id, value: taskDescription, done: false };
			tasksList.addTask(newTask);

			//add the task to DOM
			const tasksContainer = document.getElementById("tasks-list");
			const newTaskElement = this.createNewTaskElement(newTask);
			tasksContainer.insertBefore(newTaskElement, tasksContainer.lastElementChild);

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

	editTask(value, id) {
		const taskToUpdated = tasksList.getTask(id);
		const editedTask = { ...taskToUpdated, value: value };
		tasksList.updateTask(editedTask);
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
		var task = document.createElement("li");
		task.id = newTask.id;
		task.className = "list-item";
		task.draggable = true;
		task.style.textDecoration = newTask.done ? "line-through" : "";
		task.innerHTML = `
				<i class="fas fa-check-square check-icon"></i>
				<i class="fas fa-trash-alt delete-icon"></i>
				<input class="list-item-input" value=${newTask.value} disabled />
		`;
		return task;
	}
}

//${newTask.value}

//################## Initiate Classes #########################
const ui = new UI();
const tasksList = new TasksList([]);

//##################### Event Listeners #######################

// add task on enter key press
document.getElementById("new-task-input").addEventListener("keyup", function (event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		ui.addTask();
	}
});

// finish task / delete task event listeners
document.getElementById("tasks-list").addEventListener("click", (e) => {
	if (e.target.className == "fas fa-check-square check-icon") ui.taskChecked(e.target.parentNode);
	if (e.target.className == "fas fa-trash-alt delete-icon") ui.deleteTask(e.target.parentNode);
});

// initiate tasks from local storage on load
const initiateTasks = () => {
	const localStorageTasks = JSON.parse(localStorage.getItem("tasks"));
	const tasks = localStorageTasks ? localStorageTasks : [];
	tasksList.setTasks(tasks);
	ui.initiateTasks(tasks);
};
document.addEventListener("onload", initiateTasks());

// enable edit task input on double click
document.getElementById("tasks-list").addEventListener("dblclick", (e) => {
	if (e.target.className == "list-item-input") {
		e.target.disabled = false;
		e.target.className = "list-item-input-edit";
		const checkElement = document.createElement("i");
		checkElement.className = "fas fa-check";
		checkElement.addEventListener("click", () => {
			ui.editTask(e.target.value, e.target.parentNode.id);
			checkElement.remove();
			e.target.disabled = true;
			e.target.className = "list-item-input";
		});
		e.target.parentNode.appendChild(checkElement);
	}
});

//Task dragging functionality

document.addEventListener("DOMContentLoaded", (event) => {
	function handleDragStart(e) {
		this.style.opacity = "0.4";

		dragSrcEl = this;

		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/html", this.innerHTML);
	}

	function handleDragEnd(e) {
		this.style.opacity = "1";

		items.forEach(function (item) {
			item.classList.remove("over");
		});
	}

	function handleDragOver(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}

		return false;
	}

	function handleDragEnter(e) {
		this.classList.add("over");
	}

	function handleDragLeave(e) {
		this.classList.remove("over");
	}

	function handleDrop(e) {
		e.stopPropagation();

		if (dragSrcEl !== this) {
			dragSrcEl.innerHTML = this.innerHTML;
			this.innerHTML = e.dataTransfer.getData("text/html");
		}

		return false;
	}

	let items = document.querySelectorAll(".tasks-list .list-item");
	items.forEach(function (item) {
		item.addEventListener("dragstart", handleDragStart, false);
		item.addEventListener("dragover", handleDragOver, false);
		item.addEventListener("dragenter", handleDragEnter, false);
		item.addEventListener("dragleave", handleDragLeave, false);
		item.addEventListener("dragend", handleDragEnd, false);
		item.addEventListener("drop", handleDrop, false);
	});
});
