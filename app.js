const addTask = (task) => {
	const input = task ? task.value : document.getElementById("task-input").value;
	const done = task ? task.done : false;
	if (input) {
		const tasksContainer = document.getElementById("tasks-list");
		let maxTaskIndex = 0;
		tasksContainer.querySelectorAll("div").forEach((task) => {
			if (task.id > maxTaskIndex) maxTaskIndex = parseInt(task.id);
		});
		const taskIndex = task ? task.id : maxTaskIndex + 1;
		const newTaskElement = createNewTaskElement(input, taskIndex, done);
		tasksContainer.insertBefore(newTaskElement, tasksContainer.lastElementChild);
		document.getElementById("task-input").value = "";
		if (!task) {
			let tasks = localStorage.getItem("tasks") ? localStorage.getItem("tasks") : [];
			tasks = tasks.length > 0 ? JSON.parse(tasks) : tasks;
			tasks = [...tasks, { id: taskIndex, value: input, done: false }];
			localStorage.setItem("tasks", JSON.stringify(tasks));
		}
	} else alert("You must provide a task description");
};

const finishTask = (e) => {
	const item = e.target.parentNode;
	let done = item.style.textDecoration == "line-through";
	if (done) {
		item.style.textDecoration = null;
		done = false;
	} else {
		item.style.textDecoration = "line-through";
		done = true;
	}
	let tasks = JSON.parse(localStorage.getItem("tasks"));
	tasks = tasks.map((task) => (task.id == item.id ? { ...task, done: done } : task));
	localStorage.setItem("tasks", JSON.stringify(tasks));
};

const deleteTask = (e) => {
	const item = e.target.parentNode;
	item.addEventListener("transitionend", function () {
		item.remove();
	});
	item.classList.add("todo-list-item-fall");
	let tasks = JSON.parse(localStorage.getItem("tasks"));
	tasks = tasks.filter((task) => task.id != item.id);
	localStorage.setItem("tasks", JSON.stringify(tasks));
};

const clearAllTasks = () => {
	document.getElementById("tasks-list").innerHTML =
		'<span class="clear-all-text" onclick="clearAllTasks()">Clear All</span>';
	localStorage.removeItem("tasks");
};

const createNewTaskElement = (input, index, done) => {
	var task = document.createElement("div");
	task.className = "list-item";
	task.setAttribute("id", index);
	const checkIcon = createTaskChildren("i", "fas fa-check-square check-icon", (e) => finishTask(e), null, task);
	task.appendChild(checkIcon);
	const deleteIcon = createTaskChildren("i", "fas fa-trash-alt delete-icon", () => deleteTask(), null, task);
	task.appendChild(deleteIcon);
	const taskDescription = createTaskChildren("li", "list-item-text", null, input, task);
	done ? (taskDescription.style.textDecoration = "line-through") : null;
	task.appendChild(taskDescription);
	return task;
};

const createTaskChildren = (elementName, className, onclick, input, parent) => {
	const child = document.createElement(elementName);
	child.className = className;
	child.onClick = onclick ? onclick : null;
	child.innerHTML = input ? input : "";
	return child;
};

const input = document.getElementById("task-input");
input.addEventListener("keyup", function (event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		addTask();
	}
});

document.getElementById("tasks-list").addEventListener("click", handleClickDeleteOrCheck);
function handleClickDeleteOrCheck(e) {
	if (e.target.className == "fas fa-check-square check-icon") finishTask(e);

	if (e.target.className == "fas fa-trash-alt delete-icon") deleteTask(e);
}

const initiateTasks = () => {
	const tasks = JSON.parse(localStorage.getItem("tasks"));
	if (tasks) {
		tasks.forEach((task) => addTask(task));
	}
};

document.addEventListener("onload", initiateTasks());
