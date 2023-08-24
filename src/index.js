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

        return
    }

    form.addEventListener('submit', processForm);

}

const showProject = (name) => {
    const buffer = manageTasks.global.read();
    const allTasks = buffer.tasks;
    const target = buffer.projects.find(item => item.techName === name);
    display.show.project(target, allTasks);
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

    if (target.dataset.role === 'label') {
        const name = target.dataset.source;
        display.dropdown(name);
    }
}

document.addEventListener('click', handleClicks);
