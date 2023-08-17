import 'normalize.css';
import './styles.css';

import {manageTasks} from './taskmanager.js';
//methods: 
//  'create(type, name, description, dueDate, priority)',
//  'add(item, target)'
//  'remove(item)'
//  'isOutdated(item)'
//  'global.update()'
//  'global.read()'
//  'global.filter.inbox'
//  'global.filter.today'
//  'global.filter.thisWheek'
//  'global.filter.projects'
//  'global.filter.notes'

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
const sidebar = document.getElementById('side-bar');

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
        const title = titleInput.value;
        const description = descriptionTextArea.value;
        const priority = priorityRadio.value;
        const dueDate = dueDateInput.value;

        const project = manageTasks.create('project', title, description, dueDate, priority);
        const buffer = manageTasks.global.read();
        manageTasks.add(project, buffer);
        manageTasks.global.update(buffer);

        const filteredProjects = manageTasks.global.filter.projects;

        display.populateList(filteredProjects, 'projects');

        const count = filteredProjects.length;
        display.updateCounter(count, 'projects');

        console.log('Form processed');

        form.removeEventListener('submit', processForm(event));

        display.hideCardFrame(form);
    }

    form.addEventListener('submit', processForm);

}

const handleMenus = (e) => {
    const target = e.target;
    console.log(`clicked on ${target.id}`);

    if (target.id === 'add-project-button') {
        createProject();
        return
    }

    const name = target.id.replace('-button', '');

    display.dropdown(name);
}

sidebar.addEventListener('click', handleMenus);
