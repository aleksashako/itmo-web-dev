function loadPage() {
    let body = document.querySelector("body");

    const app = document.createElement('div');
    body.appendChild(app);   

    const header = document.createElement('header');
    header.className = 'page-header';

    const title = document.createElement('h1');
    title.textContent = '~ TO-DO LIST ~';

    header.appendChild(title);

    const main = document.createElement('main');
    main.className = 'content';

    const taskCreation = document.createElement('form');
    let taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = 'put the task name';
    taskInput.className = 'task-input';
    taskInput.required = true;
    taskCreation.appendChild(taskInput);

    const taskDate = document.createElement('input');
    taskDate.type = 'date';
    taskDate.placeholder = 'add the deadline';
    taskDate.onfocus = "(this.type='date')";
    taskDate.required = true; //надо ли обязательной делать?
    taskCreation.appendChild(taskDate);

    const taskType = document.createElement('select');
    taskType.name = 'type-of-task';

    const taskOptions = [
        { value: '0', text: '', className: 'empty' },
        { value: '1', text: 'study', className: 'study-task' }, //хочу потом добавить цвета разных задач
        { value: '2', text: 'life' },
        { value: '3', text: 'sport' },
        { value: '4', text: 'friends' },
        { value: '5', text: 'other' }
    ];

    taskOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        optionElement.dataset.className = option.className;
        taskType.appendChild(optionElement);
    });

    taskCreation.appendChild(taskType);

    const taskCreationButton = document.createElement('button');
    taskCreationButton.type = 'button';
    taskCreationButton.className = 'task-creation-button';
    taskCreationButton.textContent = '✔️';

    taskCreationButton.addEventListener("click", () => {
        listOfTasks.push({id: listOfTasks.length,
            taskName: taskInput.value,
            deadline: taskDate.value,
            type: taskType.value,
            isDone: false,
            isFav: false
        });
        console.log(listOfTasks); 
        console.log('button clicked. task created.');
        saveToStorage();
        renderTasks();
        taskCreation.reset(); //именно поэтому сделана form, а не label
    })
    taskCreation.appendChild(taskCreationButton);
            
    main.appendChild(taskCreation);
          
    app.appendChild(header);
    app.appendChild(main);

    const container = document.createElement('div');
    container.id = 'containerForTasks';
    container.className = 'container-for-tasks';
    app.appendChild(container);

    renderTasks();

}

let listOfTasks = []

document.addEventListener('DOMContentLoaded', loadPage);

function saveToStorage() {
    localStorage.setItem('currentTasks', JSON.stringify(listOfTasks));
}

function loadFromStorage() {
    const curTasks = localStorage.getItem('currentTasks');
    if (curTasks) {
        listOfTasks = JSON.parse(curTasks);
    }
}

function renderTasks() {
    loadFromStorage();

    const container = document.getElementById('containerForTasks');
    container.replaceChildren();

    const fragment = document.createDocumentFragment();
  
    listOfTasks.forEach(t => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.draggable = 'true';
        
        const title = document.createElement('h3');
        title.textContent = t.taskName;
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'task-info';
        
        const deadline = document.createElement('span');
        deadline.textContent = `deadline: ${t.deadline}`;
        
        const type = document.createElement('span');
        type.textContent = `type: ${t.type}`;
        type.className = 'task-type';

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'delete-task-btn';
        deleteBtn.addEventListener('click', () => {
            deleteTask(t.id);
        });

        let doneBtn = document.createElement('button');
        doneBtn.textContent = t.isDone ? '⚑' : '⚐';
        doneBtn.className = `done-task-btn ${t.isDone ? 'completed' : ''}`;

        doneBtn.addEventListener('click', () => {
            markTaskAsDone(t.id);
        });

        let favBtn = document.createElement('button');
        favBtn.textContent = t.isFav ?'★' : '☆'; //тернарный оператор дял красоты
        favBtn.className = `favor-task-btn ${t.isFav ? 'fav' : ''}`;

        favBtn.addEventListener('click', () => {
            favTask(t.id);
        });
        
        infoDiv.appendChild(deadline);
        infoDiv.appendChild(type);

        taskElement.appendChild(doneBtn);
        taskElement.appendChild(title);
        taskElement.appendChild(infoDiv);
        taskElement.appendChild(favBtn);
        // taskElement.appendChild(editTask);
        taskElement.append(deleteBtn);
        
        fragment.appendChild(taskElement);

    });

    container.appendChild(fragment);

    const clearButton = document.createElement('button');
    clearButton.textContent = '❌';
    clearButton.className = 'clear-container-btn';
    clearButton.addEventListener('click', () => {
        clearTaskContainer();
    });
    
    container.appendChild(clearButton);
}

function clearTaskContainer() {
    const container = document.getElementById('containerForTasks');
    container.replaceChildren();

    listOfTasks = [];
    saveToStorage();
}

function deleteTask(taskId) {
    listOfTasks = listOfTasks.filter(t => t.id !== taskId);

    listOfTasks.forEach((t, index) => {
        t.id = index;
    });
    saveToStorage();
    renderTasks();
}

function markTaskAsDone(taskId){
    task = listOfTasks.find(t => t.id == taskId);

if (task) {
    task.isDone = !task.isDone;
    saveToStorage();
    renderTasks();
    console.log(`Task "${task.taskName}" marked as ${task.isDone ? 'done' : 'not done'}`);
    };

    saveToStorage();
    renderTasks();
}

function favTask(taskId){
    task = listOfTasks.find(t => t.id == taskId);

if (task) {
    task.isFav = !task.isFav; // меняет состояние, чтобы кнопка две функции выполняла
    saveToStorage();
    renderTasks();
    console.log(`Task "${task.taskName}" marked as ${task.isFav ? 'fav' : 'not fav'}`);
    };

    saveToStorage();
    renderTasks();
}