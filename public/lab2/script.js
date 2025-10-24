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

    createTaskForm(main);

    createControlPanel(main);

    const container = document.createElement('div');
    container.id = 'containerForTasks';
    container.className = 'container-for-tasks';

    main.appendChild(container);
          
    app.appendChild(header);
    app.appendChild(main);

    loadFromStorage();
    renderTasks();
}

function createTaskForm() {
    const taskCreation = document.createElement('form');
    taskCreation.className = 'task-creation-form';

    let taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = 'put the task name';
    taskInput.className = 'task-input';
    taskInput.required = true;
    taskCreation.appendChild(taskInput);

    let taskDate = document.createElement('input');
    taskDate.type = 'date';
    taskDate.placeholder = 'add the deadline';
    taskDate.onfocus = "(this.type='date')";
    taskDate.required = true; //надо ли обязательной делать?
    taskCreation.appendChild(taskDate);

    let taskType = document.createElement('select');
    taskType.className = 'type-of-task-selector';

    let taskOptions = [
        { value: '0', text: '', className: 'empty' },
        { value: '1', text: 'study', className: 'study-task' }, //хочу потом добавить цвета разных задач
        { value: '2', text: 'life' },
        { value: '3', text: 'sport' },
        { value: '4', text: 'friends' },
        { value: '5', text: 'other' }
    ];

    taskOptions.forEach(option => {
        let optionElement = document.createElement('option');
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
        if (!taskInput.value.trim()) {
            alert('you cannot create task without any task-name. please, write done one');
            taskInput.focus();
            return;
        }
    
        // if (!taskDate.value) {
        //     alert('you cannot create task without deadline');
        //     taskDate.focus();
        //     return;
        // }

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
    });

    taskCreation.appendChild(taskCreationButton);
            
    main.appendChild(taskCreation);
}

function createControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.className = 'control-panel';

    let filterBtn = document.createElement('button');
    filterBtn.textContent = 'filter by status';
    filterBtn.className = 'control-btn';
    filterBtn.addEventListener('click', () => {
        filterByStatus();
    });

    let sortBtn = document.createElement('button');
    sortBtn.textContent = 'sort by date';
    sortBtn.className = 'control-btn';
    sortBtn.addEventListener('click', () => {
        sortByDate();
    });

    let clearButton = document.createElement('button');
    clearButton.textContent = 'Clear list of tasks';
    clearButton.className = 'clear-container-btn';
    clearButton.addEventListener('click', () => {
        clearTaskContainer();
    });

    let showAllBtn = document.createElement('button');
    showAllBtn.textContent = 'Show all tasks';
    showAllBtn.className = 'control-btn';
    showAllBtn.addEventListener('click', () => {
        renderTasks(); 
    });

    controlPanel.appendChild(filterBtn);
    controlPanel.appendChild(sortBtn);
    controlPanel.appendChild(showAllBtn);
    controlPanel.appendChild(clearButton);

    main.appendChild(controlPanel);

}


function addFavicon() {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = 'favicon.ico';
    
    document.head.appendChild(link);
}

let listOfTasks = []

document.addEventListener('DOMContentLoaded', () => {
    loadPage();
    addFavicon();
});

function saveToStorage() {
    localStorage.setItem('currentTasks', JSON.stringify(listOfTasks));
}

function loadFromStorage() {
    const curTasks = localStorage.getItem('currentTasks');
    if (curTasks) {
        listOfTasks = JSON.parse(curTasks);
    }
}



function renderTasks(taskList = null) {
    const container = document.getElementById('containerForTasks');

    const taskElements = container.querySelectorAll('.task-item');
    taskElements.forEach(element => element.remove());
    
    const fragment = document.createDocumentFragment();
    fragment.replaceChildren();

    const taskToRender = taskList || listOfTasks; // для выполнения фильтров и сортировки
  
    taskToRender.forEach(t => {
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

function favTask(taskId) {
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

function filterByStatus() {
    let doneList = listOfTasks.filter(t => t.isDone == true);
    renderTasks(doneList);
}

function filterByFavoritness() {
    let favList = listOfTasks.filter(t => t.isFav == true);
    renderTasks(favList);
}

function sortByDate() {
    let sortedList = listOfTasks.slice().sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    renderTasks(sortedList);
}