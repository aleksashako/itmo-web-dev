function loadPage() {
    let body = document.querySelector("body");

    const app = document.createElement('div');
    body.appendChild(app);   

    const header = document.createElement('header');
    header.className = 'page-header';

    const title = document.createElement('h1');
    title.textContent = '~ to-do list ~';

    header.appendChild(title);

    const main = document.createElement('main');
    main.className = 'content';

    createTaskForm(main);

    createControlPanel(main);

    const container = document.createElement('ul');
    container.id = 'containerForTasks';
    container.className = 'container-for-tasks';
    main.appendChild(container);

    DragDrop(container);

    const clearBtnContainer = document.createElement('div');
    clearBtnContainer.id = 'clearBtnContainer';
    clearBtnContainer.className = 'clear-btn-container';
    main.appendChild(clearBtnContainer);


    const statsContainer = document.createElement('div');
    statsContainer.id = 'statsContainer';
    statsContainer.className = 'stats-container';
    main.appendChild(statsContainer);
          
    app.appendChild(header);
    app.appendChild(main);

    loadFromStorage();
    renderTasks();
    createClearBtn();
    updateStatistics();
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

function createTaskForm(main) {
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
    // taskDate.required = true; //надо ли обязательной делать?
    taskCreation.appendChild(taskDate);

    let taskType = document.createElement('select');
    taskType.className = 'type-of-task-selector';

    let taskOptions = [
        { value: '0', text: '', className: 'empty' },
        { value: '1', text: 'study', className: 'study-task' }, //хочу потом добавить цвета разных задач
        { value: '2', text: 'life' },
        { value: '3', text: 'work' },
        { value: '4', text: 'family&friends' },
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
    taskCreationButton.textContent = '✔';

    taskCreationButton.addEventListener("click", () => {
        if (!taskInput.value.trim()) {
            alert('you cannot create task without any task-name. please, write done one');
            taskInput.focus();
            return;
        }

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

let sortDirection = 'asc';

function createControlPanel(main) {
    const controlPanel = document.createElement('div');
    controlPanel.className = 'control-panel';

    let statusFilter = document.createElement('select');
    statusFilter.className = 'status-filter';
    
    let statusOptions = [
        { value: '', text: '' },
        { value: 'done', text: 'done only' },
        { value: 'not-done', text: 'not done only' }
    ];
    
    statusOptions.forEach(option => {
        let optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        statusFilter.appendChild(optionElement);
    });
    
    statusFilter.addEventListener('change', () => {
        filterByStatus(statusFilter.value);
    });

    let typeFilter = document.createElement('select');
    typeFilter.className = 'type-filter';

    let typeOptions = [
        { value: '', text: '' },
        { value: 'study', text: 'study' },
        { value: 'life', text: 'life' },
        { value: 'work', text: 'work' },
        { value: 'family&friends', text: 'family&friends' },
        { value: 'other', text: 'other' }
    ];
    
    typeOptions.forEach(tOption => {
        let optionEl = document.createElement('option');
        optionEl.value = tOption.value;
        optionEl.textContent = tOption.text;
        typeFilter.appendChild(optionEl);
    });
    
    typeFilter.addEventListener('change', () => {
        filterByType(typeFilter.value);
    });

    let filterBtnF = document.createElement('button');
    filterBtnF.textContent = 'show favourite';
    filterBtnF.className = 'control-btn';
    filterBtnF.addEventListener('click', () => {
        filterByFavoritness();
    })

    let sortBtn = document.createElement('button');
    sortBtn.textContent = 'sort by date ↑';
    sortBtn.className = 'control-btn';
    sortBtn.addEventListener('click', () => {
        toggleSortDirection();
        sortBtn.textContent = `sort by date ${sortDirection === 'asc' ? '↑' : '↓'}`;
        sortByDate();
    });

    let showAllBtn = document.createElement('button');
    showAllBtn.textContent = 'show all tasks';
    showAllBtn.className = 'control-btn';
    showAllBtn.addEventListener('click', () => {
        renderTasks(); 
    });

    let subString = document.createElement('input');
    subString.type = 'text';
    subString.placeholder = 'search for...';
    subString.className = 'search-input';
    subString.required = true;
    
    let searchingBtn  = document.createElement('button');
    searchingBtn.textContent = '🔍';
    searchingBtn.className = 'search-btn';
    searchingBtn.addEventListener('click', () => {
        console.log(subString.value)
        if (!subString.value) {
            alert('you cannot search an empty line. please, write done something');
            subString.focus();
            return;
        }
        filterBySearch(subString.value);
    })

    function toggleSortDirection() {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    controlPanel.appendChild(showAllBtn);
    controlPanel.appendChild(subString);
    controlPanel.appendChild(searchingBtn);
    controlPanel.appendChild(statusFilter);
    controlPanel.appendChild(typeFilter);
    controlPanel.appendChild(filterBtnF);
    controlPanel.appendChild(sortBtn);

    main.appendChild(controlPanel);

}

function renderTasks(taskList = null) {
    const container = document.getElementById('containerForTasks');

    const taskElements = container.querySelectorAll('.task-item');
    taskElements.forEach(element => element.remove());
    
    const fragment = document.createDocumentFragment();
    fragment.replaceChildren();

    const tasksToRender = taskList || listOfTasks; // для выполнения фильтров и сортировки
  
    tasksToRender.forEach(t => {
        const taskElement = document.createElement('li');
        taskElement.className = 'task-item';
        taskElement.draggable = 'true';
        taskElement.dataset.taskId = t.id;
        
        const title = document.createElement('h3');
        title.textContent = t.taskName;
        title.contentEditable = false;
        
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

        let editBtn = document.createElement('button');
        editBtn.textContent = '✎';
        editBtn.className = 'edit-task-btn';

        editBtn.addEventListener('click', () => {
            editTask(t.id);
        });
        
        infoDiv.appendChild(deadline);
        infoDiv.appendChild(type);

        taskElement.appendChild(doneBtn);
        taskElement.appendChild(title);
        taskElement.appendChild(infoDiv);
        taskElement.appendChild(editBtn);
        taskElement.appendChild(favBtn);
        // taskElement.appendChild(editTask);
        taskElement.appendChild(deleteBtn);   
        
        fragment.appendChild(taskElement);

    });
    container.appendChild(fragment);

    updateStatistics();
}

function DragDrop(container) {
    let draggedItem = null;

    container.addEventListener('dragstart', (evt) => {
        if (evt.target.classList.contains('task-item')) {
            draggedItem = evt.target;
            evt.target.classList.add('selected');
            evt.dataTransfer.effectAllowed = 'move';
        }
    });

    container.addEventListener('dragend', (evt) => {
        if (evt.target.classList.contains('task-item')) {
            evt.target.classList.remove('selected');
            updateTaskOrder(container);
            draggedItem = null;
        }
    });

    container.addEventListener('dragover', (evt) => {
        evt.preventDefault();
        
        const currentElement = evt.target;
        
        const taskItem = currentElement.closest('.task-item');
        
        if (!taskItem || taskItem === draggedItem) return;
        
        const nextElement = getNextElement(evt.clientY, taskItem);
        
        if (nextElement && draggedItem === nextElement.previousElementSibling) {
            return;
        }
        
        container.insertBefore(draggedItem, nextElement);
    });

        const getNextElement = (cursorPosition, currentElement) => {
        const currentElementCoord = currentElement.getBoundingClientRect();
        const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
        
        return (cursorPosition < currentElementCenter) ? currentElement : currentElement.nextElementSibling;
    };
}

 function updateTaskOrder(container) {
    const taskElements = container.querySelectorAll('.task-item');
    const newOrder = Array.from(taskElements).map(element => {
        const taskId = parseInt(element.dataset.taskId);
        return listOfTasks.find(task => task.id === taskId);
    }).filter(task => task !== undefined);
        
    listOfTasks = newOrder;
        
    listOfTasks.forEach((task, index) => {
        task.id = index;
    });
        
    saveToStorage();
    console.log('Task order updated after drag and drop');
    console.log(listOfTasks);
}


function createClearBtn() {
    const clearBtnContainer = document.getElementById('clearBtnContainer');
    clearBtnContainer.replaceChildren();

    let clearButton = document.createElement('button');
    clearButton.textContent = 'clear all tasks';
    clearButton.className = 'clear-container-btn';
    clearButton.addEventListener('click', () => {
        clearTaskContainer();
    });

    clearBtnContainer.appendChild(clearButton);
}

function updateStatistics() {
    const statsContainer = document.getElementById('statsContainer');
    statsContainer.replaceChildren();

    let statisticsLine = document.createElement('div');
    statisticsLine.className = 'statistics-line';

    let stat1 = document.createElement('span'); 
    stat1.textContent = `total: ${listOfTasks.length}`;

    let stat2 = document.createElement('span');
    stat2.textContent = `done: ${listOfTasks.filter(t => t.isDone).length}`; 

    let stat3 = document.createElement('span');
    stat3.textContent = `to be done: ${listOfTasks.filter(t => !t.isDone).length}`;

    statisticsLine.appendChild(stat1);
    statisticsLine.appendChild(stat2);
    statisticsLine.appendChild(stat3);

    statsContainer.appendChild(statisticsLine);
}

function clearTaskContainer() {
    const container = document.getElementById('containerForTasks');
    container.replaceChildren();

    listOfTasks = [];
    saveToStorage();
    renderTasks();
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
}

function favTask(taskId) {
    task = listOfTasks.find(t => t.id == taskId);

    if (task) {
        task.isFav = !task.isFav; // меняет состояние, чтобы кнопка две функции выполняла
        saveToStorage();
        renderTasks();
        console.log(`Task "${task.taskName}" marked as ${task.isFav ? 'fav' : 'not fav'}`);
    };
}

function editTask(taskId) {
    let task = listOfTasks.find(t => t.id == taskId);

    let taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

    let title = taskElement.querySelector('h3');
    let deadlineSpan = taskElement.querySelector('.task-info span:first-child');
    
    const originalName = task.taskName;
    const originalDate = task.deadline;

    title.contentEditable = true;
    title.focus();

    let newDateInput = document.createElement('input');
    newDateInput.type = 'date';
    newDateInput.value = task.deadline;
    newDateInput.className = 'edit-date-input';
    deadlineSpan.replaceWith(newDateInput);  

    let buttons = taskElement.querySelectorAll('button');
    buttons.forEach(btn => btn.style.display = 'none');

    let saveBtn = document.createElement('button');
    saveBtn.textContent = 'apply changes';
    saveBtn.className = 'save-edit-btn';
    saveBtn.addEventListener('click', () => {
        saveEdit(taskId, title.textContent, newDateInput.value);
    });

    let cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'revert to original';
    cancelBtn.className = 'cancel-edit-btn';
    cancelBtn.addEventListener('click', () => {
        cancelEdit(taskId, originalName, originalDate);
    });

    taskElement.appendChild(saveBtn);
    taskElement.appendChild(cancelBtn);
}

function saveEdit(taskId, newName, newDate) {
    let task = listOfTasks.find(t => t.id == taskId);
    if (task) {
        if (!newName.trim()) {
            alert('Task name cannot be empty');
            return;
        }

        task.taskName = newName.trim();
        task.deadline = newDate;
        
        saveToStorage();
        renderTasks(); 
    }
}

function cancelEdit(taskId, originalName, originalDate) {
    let task = listOfTasks.find(t => t.id == taskId);
    if (task) {
        task.taskName = originalName;
        task.deadline = originalDate;
        
        renderTasks(); 
    }
}

function filterByStatus(status) {
    let filteredList;
    
    switch(status) {
         case ' ':
            filteredList = listOfTasks;
            break;
        case 'done':
            filteredList = listOfTasks.filter(t => t.isDone === true);
            break;
        case 'not-done':
            filteredList = listOfTasks.filter(t => t.isDone === false);
            break;
    }
    
    renderTasks(filteredList);
}

function filterByType(type) {
    let filteredList;
    
    switch(type) {
        case ' ':
            filteredList = listOfTasks.filter(t => t.type == 0);
            break;
        case 'study':
            filteredList = listOfTasks.filter(t => t.type == 1);
            break;
        case 'life':
            filteredList = listOfTasks.filter(t => t.type == 2);
            break;
        case 'work':
            filteredList = listOfTasks.filter(t => t.type == 3);
            break;
        case 'family&friends':
            filteredList = listOfTasks.filter(t => t.type == 4);
            break;
        case 'other':
            filteredList = listOfTasks.filter(t => t.type == 5);
            break;
    }
    
    renderTasks(filteredList);
}

function filterByFavoritness() {
    let favList = listOfTasks.filter(t => t.isFav == true);
    renderTasks(favList);
}

function sortByDate() {
    let sortedList = listOfTasks.slice().sort((a, b) => {
        const dateA = new Date(a.deadline);
        const dateB = new Date(b.deadline);
        
        if (sortDirection === 'asc') {
            return dateA - dateB;
        } else {
            return dateB - dateA; 
        }
    });
    
    renderTasks(sortedList);
    console.log(`Sorted by date: ${sortDirection === 'asc' ? 'oldest first' : 'newest first'}`);
}

function filterBySearch(str) {
    let commonTasks = listOfTasks.filter(t => t.taskName.toLowerCase().includes(str.toLowerCase()));
    renderTasks(commonTasks);
}
