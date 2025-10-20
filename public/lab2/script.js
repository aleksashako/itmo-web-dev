function createElement(tag, className, text = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
    }

function loadPage() {
    let body = document.querySelector("body");

    const app = createElement('div');
    body.appendChild(app);   

    const header = createElement('header', 'page-header');
    const title = createElement('h1', '', '~ TO-DO LIST ~');
    const description = createElement('p', 'subtitle', 'интерактивный to-do list');
    header.appendChild(title);
    header.appendChild(description);
            
    const main = createElement('main', 'content');

    const aboutSection = createElement('section', 'about');
    const aboutTitle = createElement('h2', '', 'О себе');
    const aboutText = createElement('p', '', 'Я начинающий фронтенд-разработчик, изучаю JavaScript и DOM manipulation.');
    aboutSection.appendChild(aboutTitle);
    aboutSection.appendChild(aboutText);

    const taskCreation = document.createElement('label');
    const taskInput = document.createElement('input');
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
        { value: '1', text: 'study', className: 'study-task' },
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


    // taskType.addEventListener('change', function() {
    //     console.log('Выбран тип задачи:', this.value, this.options[this.selectedIndex].text);
    // });
    taskCreation.appendChild(taskType);
              
    main.appendChild(aboutSection);
    main.appendChild(taskCreation);
            
    app.appendChild(header);
    app.appendChild(main);

}

document.addEventListener('DOMContentLoaded', loadPage);