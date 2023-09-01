import 'normalize.css';
import './styles.css';

import {manageTasks} from './taskmanager.js';

import display from './UI.js';

const stringBuffer = (() => { //buffer function to contain strings
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

const mainStateBuffer = (() => { //Buffer function to contain state of 'main' div
    let buffer = 'inbox';
    const get = (string) => {
        console.log(`main state ${buffer} buffered`)
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

const updateMain = () => { //function to refresh state of 'main' div
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

const createProject = () => { //function to habndle project creation
    console.log('createProject - run');
    const form = display.form.create.project();
    display.toggleCardScreen(form)

    return new Promise((resolve, reject)=>{

        const titleInput = document.getElementById('form-title');

        const cancelButton = document.querySelector('button[value="no"]');

        const cancel = () => {
            cancelButton.removeEventListener('click', cancel);
            form.removeEventListener('submit', processForm);
            display.refresh.cardScreen();
            display.toggleCardScreen();
            reject();
            return;
        }
        
        const processForm = (event) => {
            event.preventDefault();
            const responce = event.submitter.value
            if (responce === 'no') {
                cancel()
            }

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
            cancelButton.removeEventListener('click', cancel)

            display.toggleCardScreen()
            showProject(project.techName)
            resolve();
            console.log('createProject - stop');
            return
        }

        form.addEventListener('submit', processForm);
        cancelButton.addEventListener('click', cancel);
    }).catch((error)=>{
        console.log('Canceled project creation')
    });
}

const editProject = (source) => { //function to handle project editing
    console.log('editProject - run')
    const buffer = manageTasks.global.read()
    const projects = buffer.projects;
    const target = projects.find(item => item.techName === source);

    return new Promise((resolve, reject) => {
        const form = display.form.edit.project();
        display.toggleCardScreen(form)

        const titleInput = document.getElementById('form-title');
        titleInput.value = target.name;
        
        const processForm = (event) => {
            event.preventDefault();
            const responce = event.submitter.vlaue;
            if (responce === 'no') {
                display.refresh.cardScreen();
                display.toggleCardScreen();
                reject();
                return;
            }

            target.name = titleInput.value;

            manageTasks.global.update(buffer);

            const filteredProjects = manageTasks.global.filter.projects();

            display.refresh.projects(filteredProjects);

            console.log('Form processed');

            form.removeEventListener('submit', processForm);

            display.toggleCardScreen()
            showProject(target.techName)
            resolve();
            console.log('editProject - stop');
            return;
        }

        form.addEventListener('submit', processForm);
    }).catch((error)=>{
        console.log('Project editing cancelled');
    })
}

const removeProject = (source) => { //Function to handle project removal
    if (source) {
        console.log(`Read source for deleting ${source}`)
    } else {
        console.log(`Error cannot read source`);
        return;
    }

    const error = 'aborted'
    
    return new Promise((resolve, reject) => {

        const buffer = manageTasks.global.read()
        const projects = buffer.projects;
        const target = projects.find(item => item.techName === source);
        const tasks = buffer.tasks;
        const form = display.form.popUp();
        const formTitle = form.querySelector('h2.form-header');
        formTitle.textContent = 'Are you sure? This will remove all linked tasks'

        display.toggleCardScreen(form)
        
        const processForm = (e) => {
            e.preventDefault();

            const responce = e.submitter.value;

            const linkedTasks = target.container;

            if (target) {
                console.log(`Got target for editing ${target}`)
            } else {
                console.log(`Failed to get target for editing`);
                return
            }

            console.log(`Got ${responce} as responce`)

            switch (responce) {
                case 'no':
                    form.removeEventListener('submit', processForm);
                    display.toggleCardScreen();
                    reject(error);
                    break;
                    case 'yes':
                        linkedTasks.forEach(link => {
                            const task = tasks.find(item => item.techName === link);
                            const index = tasks.indexOf(task);
                            if (index !== -1) {
                                tasks.splice(index, 1);
                            }
                        })

                        const index = projects.indexOf(target);
                        if (index !== -1) {
                            projects.splice(index, 1);
                        }
                        form.removeEventListener('submit', processForm);

                        manageTasks.global.update(buffer);

                        const filteredProjects = manageTasks.global.filter.projects();

                        display.refresh.projects(filteredProjects);

                        console.log('Form processed');

                        display.toggleCardScreen();
    
                        display.refresh.main();
    
                        resolve();
                        break;
            }
        };

    form.addEventListener('submit', processForm);

    }).catch(error => {
        console.log('Deleting aborted');
    });
};

const removeTask = (source) => { // Handles task removal
    if (source) {
        console.log(`Read source for deleting ${source}`)
    } else {
        console.log(`Error cannot read source`);
        return;
    }

    const error = 'aborted'

    return new Promise((resolve, reject) => {
        const form = display.form.popUp();

        display.toggleCardScreen(form);

        const processForm = (e) => {
            e.preventDefault();

            const responce = e.submitter.value;
            const buffer = manageTasks.global.read();
            const allTasks = buffer.tasks;
            const target = allTasks.find(item => item.techName === source)

            if (target) {
                console.log(`Got target for editing ${target}`)
            } else {
                console.log(`Failed to get target for editing`);
                return
            }

            console.log(`Got ${responce} as responce`)

            switch (responce) {
                case 'no':
                    form.removeEventListener('submit', processForm);
                    display.toggleCardScreen();
                    reject(error);
                    break;
                    case 'yes':
                        const index = buffer.tasks.indexOf(target);
                        if (index !== -1) {
                            buffer.tasks.splice(index, 1);
                            manageTasks.global.update(buffer);
    
                            form.removeEventListener('submit', processForm);

                            display.toggleCardScreen();
    
                            display.refresh.main();
                            display.refresh.homeCounter(buffer.tasks)
                            updateMain();
    
                            resolve();
                        }
                    break;
            }
        }

        form.addEventListener('submit', processForm);

    }).catch(error => {
        console.log('Deleting aborted');
    }); 
}

const removeNote = (source) => { //Handles note removal
    console.log('removeNote - start');
    if (source) {
        console.log(`Read source for deleting ${source}`)
    } else {
        console.log(`Error cannot read source`);
        return;
    }

    const error = 'aborted'

    return new Promise((resolve, reject) => {
        const form = display.form.popUp();

        display.toggleCardScreen(form);

        const processForm = (e) => {
            e.preventDefault();

            const responce = e.submitter.value;
            const buffer = manageTasks.global.read();
            const allNotes = buffer.notes;
            const target = allNotes.find(item => item.techName === source)

            if (target) {
                console.log(`Got target for removing ${target}`)
            } else {
                console.log(`Failed to get target for removing`);
                return
            }

            console.log(`Got ${responce} as responce`)

            switch (responce) {
                case 'no':
                    form.removeEventListener('submit', processForm);
                    display.toggleCardScreen();
                    reject(error);
                    break;
                    case 'yes':
                        const index = buffer.notes.indexOf(target);
                        if (index !== -1) {
                            buffer.notes.splice(index, 1);
                            manageTasks.global.update(buffer);
    
                            form.removeEventListener('submit', processForm);

                            display.toggleCardScreen();
    
                            display.refresh.main();
                            display.refresh.notesCounter(buffer.notes)
                            updateMain();
                            
                            console.log('removeNote - stop')
                            resolve();
                        }
                    break;
            }
        }

        form.addEventListener('submit', processForm);

    }).catch(error => {
        console.log('Deleting aborted');
    }); 
}

const createTask = () => { //Handles task creation
    console.log('createTask - run')
    return new Promise((resolve, reject) => {
        const form = display.form.create.task();
        display.toggleCardScreen(form);
        const radio = document.getElementById('priority-normal');
        radio.checked = true;

        const today = new Date();
        const dueDateInput = document.getElementById('form-date');
        dueDateInput.value = today;
        const cancelButton = document.querySelector('button[value="no"]');

        const cancel = () => {
            cancelButton.removeEventListener('click', cancel);
            form.removeEventListener('submit', processForm);
            display.refresh.cardScreen();
            display.toggleCardScreen();
            reject();
            return;
        }

        const processForm = (event) => {
            event.preventDefault()
            const responce = event.submitter.value;
            if (responce === 'no') {
                cancel();
            }

            const nameInput = document.getElementById('form-title');
            const descInput = document.getElementById('form-description');
            const priorInput = document.querySelector('input[name="priority"]:checked');

            const name = nameInput.value;
            const desc = descInput.value;
            const prior = priorInput.value;
            const dueDate = dueDateInput.value;

            const task = manageTasks.create.task(name, desc, dueDate, prior);

            const buffer = manageTasks.global.read();
            buffer.tasks.push(task);
            manageTasks.global.update(buffer);

            form.removeEventListener('submit', processForm);
            cancelButton.removeEventListener('click', cancel)
            display.toggleCardScreen();

            stringBuffer.get(task.techName);
            display.refresh.homeCounter(buffer.tasks);
            updateMain();
            resolve();
            console.log('createTask - stop')
            return;
        }

        form.addEventListener('submit', processForm);
        cancelButton.addEventListener('click', cancel);

    }).catch((error) => {
        console.log('Task creatiion cancelled')
    })
}

const createNote = () => { //Handles note creation
    console.log('createNote - start')
    return new Promise((resolve, reject) => {
        const form = display.form.create.note();
        display.toggleCardScreen(form);

        const cancelButton = document.querySelector('button[value="no"]');

        const cancel = () => {
            cancelButton.removeEventListener('click', cancel);
            form.removeEventListener('submit', processForm);
            display.refresh.cardScreen();
            display.toggleCardScreen();
            reject();
            return;
        }

        const processForm = (event) => {
            event.preventDefault()
            const responce = event.submitter.value;
            if (responce === 'no') {
                cancel()
            }

            const nameInput = document.getElementById('form-title');
            const descInput = document.getElementById('form-description');

            const name = nameInput.value;
            const desc = descInput.value;

            const note = manageTasks.create.note(name, desc);

            const buffer = manageTasks.global.read();
            buffer.notes.push(note);
            manageTasks.global.update(buffer);

            form.removeEventListener('submit', processForm);
            cancelButton.removeEventListener('click', cancel);
            display.toggleCardScreen();

            display.refresh.notesCounter(buffer.notes);
            updateMain();
            resolve();
            console.log('createNote - stop');
            return;
        }

        form.addEventListener('submit', processForm);
        cancelButton.addEventListener('click', cancel);

    }).catch((error) => {
        console.log('Note creation cancelled')
    })
}

const editNote = (source) => { //Handles note editing
    console.log('editNote - run')
    if (source) {
        console.log(`Read source for editing ${source}`)
    } else {
        console.log(`Error cannot read source`);
        return;
    }

    const buffer = manageTasks.global.read();
    const allNotes = buffer.notes;
    const target = allNotes.find(item => item.techName === source);

    if (target) {
        console.log(`Got target for editing ${target}`)
    } else {
        console.log(`Failed to get target for editing`);
        return
    }

    return new Promise((resolve, reject) => {
        const form = display.form.edit.note();
        display.toggleCardScreen(form);

        const nameInput = document.getElementById('form-title');
        const descInput = document.getElementById('form-description');

        nameInput.value = target.name;
        descInput.value = target.description;

        const processForm = (event) => {
            event.preventDefault()
            const responce = event.submitter.value;

            if (responce === 'no') {
                display.refresh.cardScreen();
                display.toggleCardScreen();
                reject();
                return;
            }
            
            target.name = nameInput.value;
            target.description = descInput.value;

            manageTasks.global.update(buffer);

            form.removeEventListener('submit', processForm);
            display.toggleCardScreen();

            display.refresh.main();
            updateMain();

            console.log('editNote - stop')
            resolve();
        }

        form.addEventListener('submit', processForm);

    }).catch(error => {
        console.log('Editing cancelled');
    });  
}

const editTask = (source) => { //Handles task editing
    console.log('editTask - run')
    if (source) {
        console.log(`Read source for editing ${source}`)
    } else {
        console.log(`Error cannot read source`);
        return;
    }

    const buffer = manageTasks.global.read();
    const allTasks = buffer.tasks;
    const target = allTasks.find(item => item.techName === source);

    if (target) {
        console.log(`Got target for editing ${target}`)
    } else {
        console.log(`Failed to get target for editing`);
        return
    }

    return new Promise((resolve, reject) => {
        const form = display.form.edit.task();
        display.toggleCardScreen(form);

        const nameInput = document.getElementById('form-title');
        const descInput = document.getElementById('form-description');
        const dueDateInput = document.getElementById('form-date')
        const priority = target.priority;
        const radio = document.querySelector(`[value=${priority}]`);
        radio.checked = true;

        nameInput.value = target.name;
        descInput.value = target.description;
        dueDateInput.value = target.noFormatDate

        const processForm = (event) => {
            event.preventDefault()
            const responce = event.submitter.value;

            if (responce === 'no') {
                display.refresh.cardScreen();
                display.toggleCardScreen();
                reject();
                return;
            }

            const priorRadioChecked = document.querySelector('input[name="priority"]:checked');
            
            target.name = nameInput.value;
            target.description = descInput.value;
            target.noFormatDate = dueDateInput.value;
            target.priority = priorRadioChecked.value;

            manageTasks.global.update(buffer);

            form.removeEventListener('submit', processForm);
            display.toggleCardScreen();

            display.refresh.main();
            updateMain();
            console.log('editTask - stop')

            resolve();
        }

        form.addEventListener('submit', processForm);

    }).catch(error => {
        console.log('Editing cancelled');
    });  
}

const showProject = (name) => { //shows project in 'main' div
    const buffer = manageTasks.global.read();
    const allTasks = buffer.tasks;
    const target = buffer.projects.find(item => item.techName === name);
    mainStateBuffer.get(name)
    display.show.project(target, allTasks);
}

const showInbox = () => { //shows 'inbox' section in 'main' div
    console.log('showInbox - run')
    const list = manageTasks.global.filter.inbox();
    console.log(`showInbox - list: ${list}`)
    mainStateBuffer.get('inbox');
    console.log('showInbox - buffered')
    display.show.inbox(list);
    console.log('showInbox - stop')
}

const showToday = () => { //shows 'today' section in 'main' div
    console.log('showToday - run')
    const list = manageTasks.global.filter.today();
    mainStateBuffer.get('today');
    display.show.today(list);
    console.log('showToday - stop')
}

const showThisWheek = () => { //shows 'this wheek' section in 'main' div
    console.log('showThisWheek - run');
    const list = manageTasks.global.filter.thisWheek();
    mainStateBuffer.get('this-wheek');
    display.show.thisWheek(list);
    console.log('showThisWheek - stop');
}

const showTask = (name) => { //shows task card
    const buffer = manageTasks.global.read();
    const target = buffer.tasks.find(item => item.techName === name);
    display.show.task(target);
}

const showNote = (name) => { //shows note card
    const buffer = manageTasks.global.read();
    const target = buffer.notes.find(item => item.techName === name);
    display.show.note(target);
}

const showNotes = () => { //shows 'notes' section in 'main' div
    console.log('showNotes - run');
    const list = manageTasks.global.filter.notes();
    mainStateBuffer.get('notes');
    display.show.notes(list);
    console.log('showNotes - stop');
}

const toggleCompleteLabel = (source) => { //handles 'complete' state toggling in the 'main' div
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

const toggleCompleteCard = (source) => { //handles 'complete' toggling in task card
    const buffer = manageTasks.global.read();
    const allTasks = buffer.tasks;
    const target = allTasks.find(item => item.techName === source);
    const title = document.querySelector('div.card-name');
    const checkbox = document.getElementById('checkspan');
    const relativeChecbox = document.getElementById(`complete-${source}`);
    const relativeTitle = document.querySelector(`[data-role="task-name"][data-source="${source}"]`);

    switch (target.isComplete) {
        case true:
            target.isComplete = false;
            title.classList.remove('line-through');
            relativeTitle.classList.remove('line-through');
            checkbox.classList.remove('checkbox');
            checkbox.classList.add('uncheckbox');
            relativeChecbox.checked = false;
            break;
        case false:
            target.isComplete = true;
            title.classList.add('line-through');
            relativeTitle.classList.add('line-through');
            checkbox.classList.add('checkbox');
            checkbox.classList.remove('uncheckbox');
            relativeChecbox.checked = true;
            break;
    }
    manageTasks.global.update(buffer);
}

const close = () => { //handles card view closing
    display.toggleCardScreen()
    display.refresh.cardScreen();
    updateMain();
}

const addTaskToProject = (name) => { //handles linking tasks to project
    const buffer = manageTasks.global.read();
    
    createTask().then(() => {

        const project = buffer.projects.find(item => item.techName === name);
        const task = stringBuffer.give();

        project.container.push(task);
        showProject(name);
    }).catch((error) => {
        console.log('Task creation was cancelled, cannot link task')
    });
}

function handleClicks(e) { //handles mouse input
    const target = e.target;

    // if target elemen don't havve data attributes - breaks
    if (target.dataset.role && target.dataset.source) {
        console.log(`clicked on ${target.dataset.role}, ${target.dataset.source}`);
    } else {
        return;
    }

    //calls note removal
    if (target.dataset.role === 'delete-note') {
        const name = target.dataset.source;
        removeNote(name);
    }

    //calls note editing
    if (target.dataset.role === 'edit-note') {
        const name = target.dataset.source;
        editNote(name);
    }

    //calls note card
    if (target.dataset.role === 'note-name') {
        const name = target.dataset.source;
        showNote(name);
    }

    //calls note creation
    if (target.dataset.role === 'add-note-button') {
        createNote();
    }

    //calls task creation
    if (target.dataset.role === "add-task-button") {
        createTask();
    }

    //calls 'inbox' screen
    if (target.dataset.role === 'label'
    && target.dataset.source === 'inbox' 
    || target.dataset.source === 'home') {
        showInbox();
    }

    //calls 'today' screen
    if (target.dataset.role === 'label' 
    && target.dataset.source === 'today') {
        showToday();
    }

    //calls 'this wheek' screen
    if (target.dataset.role === 'label' 
    && target.dataset.source === 'this-wheek') {;
        showThisWheek();
    }

    //calls 'notes' screen
    if (target.dataset.role === 'label'
    && target.dataset.source === 'notes') {
        showNotes();
    }

    //calls project removal
    if (target.dataset.role === 'project-delete') {
        const name = target.dataset.source;
        removeProject(name);
    }

    //calls project editing
    if (target.dataset.role === 'project-edit') {
        const name = target.dataset.source;
        editProject(name);
    }

    //calls 'complete' toggling
    if (target.dataset.role === 'card-mark-complete') {
        const name = target.dataset.source;
        toggleCompleteCard(name);
    }

    //calls task removal
    if (target.dataset.role === 'delete-task') {
        const name = target.dataset.source;
        removeTask(name);
    }

    //calls task edition
    if (target.dataset.role === 'edit-task') {
        const name = target.dataset.source;
        editTask(name);
    }

    //calls 'complete' toggling
    if (target.dataset.role === 'mark-complete-button') {
        const name = target.dataset.source;
        toggleCompleteLabel(name);
    }

    //closes card view
    if (target.dataset.role === 'close-button') {
        close();
    }

    //calls task card view
    if (target.dataset.role === 'task-name') {
        const name = target.dataset.source;
        showTask(name);
    }

    //calls project creation
    if (target.dataset.role === 'add-button' 
    && target.dataset.source === 'projects') {
        createProject();
        return;
    }

    //shows project in 'main' div
    if (target.dataset.role === 'project-label') {
        const name = target.dataset.source;
        showProject(name);
        return;
    }

    //calls task creating, assigned o project
    if (target.dataset.role === 'project-add-button') {
        const name = target.dataset.source;
        addTaskToProject(name);
        return
    }

    //calls func to handle dropdown menus
    if (target.dataset.role === 'label' 
    && target.dataset.source !== "inbox"
    && target.dataset.source !== "today"
    && target.dataset.source !== "this-wheek") {
        const name = target.dataset.source;
        display.dropdown(name);
    }
}

const pageStart = () => { //handles page staring condition
    console.log('DOM content loaded')
    showInbox();
    const buffer = manageTasks.global.read()
    display.refresh.projects(buffer.projects);
    display.refresh.homeCounter(buffer.tasks);
    display.refresh.notesCounter(buffer.notes);
    document.removeEventListener('DOMContentLoaded', pageStart);
}

document.addEventListener('DOMContentLoaded', pageStart);

document.addEventListener('click', handleClicks);
