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
    // callCard(e, array),
    // callAddForm(),
    // callEditForm(target),
    // hideCardFrame(card),
    // populateList(array, name),
    // updateCounter (count, name),
    // clear(target)

const sidebar = document.querySelector('div.aside');

const createProject = () => {
    const list = document.getElementById('projects-list');
    const form = display.callAddForm();
    const typeRadio = document.getElementById('type-project');
    typeRadio.checked = true;

    const titleInput = document.getElementById('title-input');
    const descriptionTextArea = document.getElementById('task-desc');
    const priorityRadio = document.querySelector('input[name="priority"]:checked');
    const dueDateInput = document.getElementById('task-date');

    const processForm = (event) => {
        event.preventDefault();

        const title = titleInput.value;

        const project = manageTasks.create.project(title);
        const buffer = manageTasks.global.read();
        buffer.projects.push(project);
        manageTasks.global.update(buffer);

        const filteredProjects = manageTasks.global.filter.projects();
        console.log(filteredProjects);

        display.populateList(filteredProjects, 'projects');

        const count = filteredProjects.length;
        display.updateCounter(count, 'projects');

        console.log('Form processed');
        console.log(manageTasks.global.read())

        form.removeEventListener('submit', processForm);

        display.hideCardFrame(form);

        return
    }

    form.addEventListener('submit', processForm);

}

const handleSidebar = (e) => {
        const target = e.target;

    if (target.dataset.role && target.dataset.source) {
        console.log(`clicked on ${target.dataset.role}, ${target.dataset.source}`);
    } else{
        return
    }

    if (target.dataset.role === 'add-button' && target.dataset.source === 'projects') {
        createProject();
        return
    }

    if (target.dataset.role === 'label') {
        const name = target.dataset.source;
        display.dropdown(name);
    }
}

sidebar.addEventListener('click', handleSidebar);
