const inputBox = document.getElementById('task_input');
const list = document.getElementById('task_list');

display();

function addTask() {
    event.preventDefault();
    if (inputBox.value === '') {
        alert("Please enter a task.");
        return;
    }

    const actions = document.createElement('div');
    actions.innerHTML = `<div class="actions">
                        <span class="material-symbols-outlined edit">edit</span>
                        <span class="material-symbols-outlined delete">delete</span>
                        <span class="material-symbols-outlined complete">radio_button_unchecked</span>
                    </div>`;

    const task = document.createElement('li');

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.className = 'text';
    taskInput.value = inputBox.value;
    taskInput.readOnly = true;

    task.appendChild(taskInput);
    task.appendChild(actions);
    task.classList.add('task');
    list.appendChild(task);

    inputBox.value = '';
    saveData();
}

function completeTask(target) {
    const taskLi = target.closest('li');
    const taskInput = taskLi.querySelector('.text');

    if (target.innerText.toLowerCase() === "radio_button_unchecked") {
        target.innerText = "radio_button_checked";
        target.style.color = "green";
        taskLi.style.backgroundColor = "#16db65";
        taskLi.classList.add("completed");
    } else {
        target.innerText = "radio_button_unchecked";
        target.style.color = "black";
        taskLi.style.backgroundColor = "#edeef0";
        taskLi.classList.remove("completed");
    }
    updateLocalStorage();
}

function editTask(editTarget) {
    const taskLi = editTarget.closest('li');
    const taskInput = taskLi.querySelector('.text');

    if (editTarget.innerText.toLowerCase() === "edit") {
        taskInput.removeAttribute("readonly");
        taskInput.focus();
        editTarget.innerText = "Save";
    } else {
        taskInput.setAttribute("readonly", "readonly");
        editTarget.innerText = "Edit";
        taskInput.value = taskInput.value.trim();
        updateLocalStorage();
    }
}

list.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete')) {
        e.target.closest('li').remove();
        saveData();
    } else if (e.target.classList.contains('edit')) {
        editTask(e.target);
    } else if (e.target.classList.contains('complete')) {
        completeTask(e.target);
        updateLocalStorage();
    }
});

function saveData() {
    updateLocalStorage();
}

function updateLocalStorage() {
    const tasks = document.querySelectorAll('.task');
    const taskData = [];

    tasks.forEach(task => {
        const text = task.querySelector('.text').value;
        const isCompleted = task.classList.contains('completed');
        taskData.push({ text: text, completed: isCompleted });
    });

    localStorage.setItem("data", JSON.stringify(taskData));
}


function display() {
    const savedData = localStorage.getItem("data");
    if (savedData) {
        const taskData = JSON.parse(savedData);
        taskData.forEach(taskText => {
            const actions = document.createElement('div');
            actions.innerHTML = `<div class="actions">
                                <span class="material-symbols-outlined edit">edit</span>
                                <span class="material-symbols-outlined delete">delete</span>
                                <span class="material-symbols-outlined complete">radio_button_unchecked</span>
                            </div>`;

            const task = document.createElement('li');

            const taskInput = document.createElement('input');
            taskInput.type = 'text';
            taskInput.classList.add('text');
            taskInput.value = taskText.text;
            taskInput.readOnly = true;

            task.appendChild(taskInput);
            task.appendChild(actions);
            task.classList.add('task');
            if (taskText.completed) {
                actions.querySelector('.complete').style.color = "green";
                actions.querySelector('.complete').innerText = "radio_button_checked";
                task.style.backgroundColor = "#4fe68c";
                task.classList.add("completed");
            }

            list.appendChild(task);
        });
    }
}
