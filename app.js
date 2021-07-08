const addTask = ()=>{
    const tasksContainer = document.getElementById('tasks-list');
    let maxTaskIndex = 0;
    tasksContainer.querySelectorAll('div').forEach(task=>{if (task.id.substring(4,5) > maxTaskIndex) maxTaskIndex =  parseInt(task.id.substring(4,5))});
    const input = document.getElementById('task-input').value;
    const newTaskElement = createNewTaskElement(input, maxTaskIndex+1);
    tasksContainer.insertBefore(newTaskElement, tasksContainer.lastElementChild);
    document.getElementById("task-input").value = "";
}

const finishTask = (e)=>{
    e.target.parentNode.style.textDecoration = 'line-through';
}

const deleteTask = (e)=>{
    const item = e.target.parentNode
    item.addEventListener('transitionend', function () {
        item.remove(); 
    });
    item.classList.add('todo-list-item-fall');
}

const clearAllTasks = ()=>{
    document.getElementById('tasks-list').innerHTML = '<span class="clear-all-text" onclick="clearAllTasks()">Clear All</span>'
}

const createNewTaskElement = (input, index)=>{
    var task = document.createElement('div');
    task.className = 'list-item';
    const taskId = `task${index}`;
    task.setAttribute('id',taskId);
    appendTaskChildren('i', "fas fa-check-square check-icon",(e)=> finishTask(e), null, task);
    appendTaskChildren('i', "fas fa-trash-alt delete-icon", ()=>deleteTask(), null, task);
    appendTaskChildren('li', 'list-item-text', null, input, task);
    return task;
}

const appendTaskChildren = (elementName, className, onclick, input, parent)=>{
    const child = document.createElement(elementName);
    child.className = className;
    child.onClick = onclick ? onclick : null;
    child.innerHTML = input ? input : ""
    parent.appendChild(child);
}

const input = document.getElementById("task-input");
input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      addTask()
    }
})

document.getElementById('tasks-list').addEventListener('click', handleClickDeleteOrCheck);
function handleClickDeleteOrCheck(e) {
    if (e.target.className == 'fas fa-check-square check-icon')
         finishTask(e);

    if (e.target.className == 'fas fa-trash-alt delete-icon')
        deleteTask(e);
}