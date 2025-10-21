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
            type: taskType.value
        });
        console.log(listOfTasks); 
        console.log('button clicked. task created.');
        saveToStorage();
        taskCreation.reset(); //именно поэтому сделана form, а не label
    })
    taskCreation.appendChild(taskCreationButton);
            
    main.appendChild(taskCreation);
            
    app.appendChild(header);
    app.appendChild(main);

}

let listOfTasks = []

document.addEventListener('DOMContentLoaded', loadPage);

function saveToStorage() {
    localStorage.setItem('currentTasks', JSON.stringify(listOfTasks));
}