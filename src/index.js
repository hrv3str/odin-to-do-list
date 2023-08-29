import 'normalize.css';
import './styles.css';

import {manageTasks} from './taskmanager.js';
//methods:
    // create:
        // task(name, description, dueDate, priority),
        // note(name, description),
        // project(name)

    // store(object),
    // remove(techName),
    // update(techName, sourceObject),
    // locate(techName),
    // linkToProject(techName, object),
    // getProjectList(techName)

    // global:
        // filter:
            // inbox,
            // today,
            // thisWheek,
            // projects,
            // notes

        // update(bufferObject),
        // read

import storage from './storagemanager.js';
//methods: read(), write()

import display from './UI.js';
//methods:
    //dropdown(name),
    //toggleCardScreen()

const stringBuffer = (() => {
    let buffer = '';
    const get = (string) => {
        buffer = string;
    }
    const give = () => {
        const output = buffer;
        buffer = '';
        return output;
    }
    const clear = () => {
        buffer = '';
    }
    return {
        get,
        give,
        clear
    }
})();

const cardBuffer = (() => {
    let buffer = null;
    const get = (item) => {
        buffer = item;
    }
    const give = () => {
        const output = buffer;
        buffer = null;
        return output;
    }
    const clear = () => {
        buffer = null;
    }
    return {
        get,
        give,
        clear
    }
})();

const mainStateBuffer = (() => {
    let buffer = '';
    const get = (string) => {
        buffer = string;
    }
    const give = () => {
        const output = buffer;
        buffer = '';
        return output;
    }
    const clear = () => {
        buffer = '';
    }
    return {
        get,
        give,
        clear
    }
})();

const updateMain = () => {
    const type = mainStateBuffer.give()
    switch (type) {
        case 'inbox':
            showInbox();
            break;
        case 'today':
            showToday();
            break;
        case 'this-wheek':
            showThisWheek();
            break;
        case 'notes':
            showNotes();
            break;
        case '':
            console.log('Can not update main, buffer is empty');
            break;
        default:
            showProject(type);
            break;
    }
}

const createProject = () => {
    const form = display.form.create.project();
    display.toggleCardScreen(form)

    const titleInput = document.getElementById('form-title');
    
    const processForm = (event) => {
        event.preventDefault();

        const title = titleInput.value;

        const project = manageTasks.create.project(title);
        const buffer = manageTasks.global.read();
        buffer.projects.push(project);
        manageTasks.global.update(buffer);

        const filteredProjects = manageTasks.global.filter.projects();
        console.log(filteredProjects);

        display.refresh.projects(filteredProjects);

        console.log('Form processed');
        console.log(manageTasks.global.read())

        form.removeEventListener('submit', processForm);

        display.toggleCardScreen(form)
        showProject(project.techName)

        return
    }

    form.addEventListener('submit', processForm);

}

const removeTask = (source) => {
    return new Promise((resolve, reject) => {
        const form = display.form.popUp();
        display.toggleCardScreen(form);

        const processForm = (e) => {
            e.preventDefault();

            const responce = e.submitter.value;
            const buffer = manageTasks.global.read();
            const allTasks = buffer.tasks;
            const target = allTasks.find(item => item.techName === source)

            switch (responce) {
                case 'no':
                    reject();
                    break;
                    case 'yes':
                        const index = buffer.tasks.indexOf(target);
                        if (index !== -1) {
                            buffer.tasks.splice(index, 1);
                            manageTasks.global.update(buffer);
    
                            form.removeEventListener('submit', processForm);
                            display.toggleCardScreen(form);
    
                            display.refresh.main();
                            updateMain();
    
                            resolve();
                        }
                    break;
            }
        }

        form.addEventListener('submit', processForm);

    }); 
}

const createTask = () => {
    return new Promise((resolve) => {
        const form = display.form.create.task();
        display.toggleCardScreen(form);

        const processForm = (event) => {
            event.preventDefault()
            const nameInput = document.getElementById('form-title');
            const descInput = document.getElementById('form-description');
            const priorInput = document.querySelector('input[name="priority"]:checked');
            const dueDateInput = document.getElementById('form-date')

            const name = nameInput.value;
            const desc = descInput.value;
            const prior = priorInput.value;
            const dueDate = dueDateInput.value;

            const task = manageTasks.create.task(name, desc, dueDate, prior);

            const buffer = manageTasks.global.read();
            buffer.tasks.push(task);
            manageTasks.global.update(buffer);

            form.removeEventListener('submit', processForm);
            display.toggleCardScreen(form);

            stringBuffer.get(task.techName);
            resolve();
        }

        form.addEventListener('submit', processForm);

    });  
}

const editTask = (source) => {
    const buffer = manageTasks.global.read();
    const allTasks = buffer.tasks;
    const target = allTasks.find(item => item.techName === source);

    return new Promise((resolve) => {
        const form = display.form.edit.task();
        display.toggleCardScreen(form);

        const nameInput = document.getElementById('form-title');
        const descInput = document.getElementById('form-description');
        const dueDateInput = document.getElementById('form-date')

        nameInput.value = target.name;
        descInput.value = target.description;

        const radio = document.querySelector(`[name="priority"][value="${target.priority}"]`);
        if (!radio.checked) {
            radio.checked = true;
        } else {
            return;
        }

        dueDateInput.value = target.noFormatDate;

        const processForm = (event) => {
            event.preventDefault()

            const priorRadioChecked = document.querySelector('input[name="priority"]:checked');
            
            target.name = nameInput.value;
            target.description = descInput.value;
            target.noFormatDate = dueDateInput.value;
            target.priority = priorRadioChecked.value;

            manageTasks.global.update(buffer);

            form.removeEventListener('submit', processForm);
            display.toggleCardScreen(form);

            display.refresh.main();
            updateMain();

            resolve();
        }

        form.addEventListener('submit', processForm);

    });  
}

const showProject = (name) => {
    const buffer = manageTasks.global.read();
    const allTasks = buffer.tasks;
    const target = buffer.projects.find(item => item.techName === name);
    mainStateBuffer.get(name)
    display.show.project(target, allTasks);
}

const showTask = (name) => {
    const buffer = manageTasks.global.read();
    const target = buffer.tasks.find(item => item.techName === name);
    const card = display.show.task(target);
    cardBuffer.get(card);
}

const toggleCompleteLabel = (source) => {
    const buffer = manageTasks.global.read();
    const allTasks = buffer.tasks;
    const target = allTasks.find(item => item.techName === source);
    const title = document.querySelector(`[data-role="task-name"][data-source="${source}"]`);
    switch (target.isComplete) {
        case true:
            target.isComplete = false;
            title.classList.remove('line-through');
            break;
        case false:
            target.isComplete = true;
            title.classList.add('line-through');
            break;
    }
    manageTasks.global.update(buffer);
}

const close = () => {
    const target = cardBuffer.give();
    display.toggleCardScreen(target)
    display.refresh.cardScreen();
}

const addTaskToProject = (name) => {
    const buffer = manageTasks.global.read();
    
    createTask().then(() => {

        const project = buffer.projects.find(item => item.techName === name);
        const task = stringBuffer.give();

        project.container.push(task);
        showProject(name);
    });
}

function handleClicks(e) {
    const target = e.target;

    if (target.dataset.role && target.dataset.source) {
        console.log(`clicked on ${target.dataset.role}, ${target.dataset.source}`);
    } else {
        return;
    }

    if (target.dataset.role === 'delete-button') {
        const name = target.dataset.source;
        removeTask(name);
    }

    if (target.dataset.role === 'edit-button') {
        const name = target.dataset.source;
        editTask(name);
    }

    if (target.dataset.role === 'mark-complete-button') {
        const name = target.dataset.source;
        toggleCompleteLabel(name);
    }

    if (target.dataset.role === 'close-button') {
        close();
    }

    if (target.dataset.role === 'task-name') {
        const name = target.dataset.source;
        showTask(name);
    }

    if (target.dataset.role === 'add-button' && target.dataset.source === 'projects') {
        createProject();
        return;
    }

    if (target.dataset.role === 'project-label') {
        const name = target.dataset.source;
        showProject(name);
        return;
    }

    if (target.dataset.role === 'project-add-button') {
        const name = target.dataset.source;
        addTaskToProject(name);
        return
    }

    if (target.dataset.role === 'label') {
        const name = target.dataset.source;
        display.dropdown(name);
    }
}

document.addEventListener('click', handleClicks);
