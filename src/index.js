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

        display.toggleCardScreen(form);
        showProject(project.techName)

        return
    }

    form.addEventListener('submit', processForm);

}

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


const showProject = (name) => {
    const buffer = manageTasks.global.read();
    const allTasks = buffer.tasks;
    const target = buffer.projects.find(item => item.techName === name);
    display.show.project(target, allTasks);
}

const showTask = (name) => {
    const buffer = manageTasks.global.read();
    const target = buffer.tasks.find(item => item.techName === name);
    display.show.task(target);
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

display.toggleCardScreen();

document.addEventListener('click', handleClicks);
