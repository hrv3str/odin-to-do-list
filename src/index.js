import 'normalize.css';
import './styles.css';

import {manageTasks} from './taskmanager.js';

import display from './UI.js';

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

const mainStateBuffer = (() => {
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

        display.toggleCardScreen()
        showProject(project.techName)

        return
    }

    form.addEventListener('submit', processForm);

}

const editProject = (source) => {
    const buffer = manageTasks.global.read()
    const projects = buffer.projects;
    const target = projects.find(item => item.techName === source);

    return new Promise((resolve) => {
        const form = display.form.edit.project();
        display.toggleCardScreen(form)

        const titleInput = document.getElementById('form-title');
        titleInput.value = target.name;
        
        const processForm = (event) => {
            event.preventDefault();

            target.name = titleInput.value;

            manageTasks.global.update(buffer);

            const filteredProjects = manageTasks.global.filter.projects();

            display.refresh.projects(filteredProjects);

            console.log('Form processed');

            form.removeEventListener('submit', processForm);

            display.toggleCardScreen()
            showProject(target.techName)
            resolve();
        }

        form.addEventListener('submit', processForm);
    });
}

const removeProject = (source) => {
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

const removeTask = (source) => {
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

const removeNote = (source) => {
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

const createTask = () => {
    return new Promise((resolve) => {
        const form = display.form.create.task();
        display.toggleCardScreen(form);
        const radio = document.getElementById('priority-normal');
        radio.checked = true;

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
            display.toggleCardScreen();

            stringBuffer.get(task.techName);
            display.refresh.homeCounter(buffer.tasks);
            updateMain();
            resolve();
        }

        form.addEventListener('submit', processForm);

    });  
}

const createNote = () => {
    return new Promise((resolve) => {
        const form = display.form.create.note();
        display.toggleCardScreen(form);

        const processForm = (event) => {
            event.preventDefault()
            const nameInput = document.getElementById('form-title');
            const descInput = document.getElementById('form-description');

            const name = nameInput.value;
            const desc = descInput.value;

            const note = manageTasks.create.note(name, desc);

            const buffer = manageTasks.global.read();
            buffer.notes.push(note);
            manageTasks.global.update(buffer);

            form.removeEventListener('submit', processForm);
            display.toggleCardScreen();

            display.refresh.notesCounter(buffer.notes);
            updateMain();
            resolve();
        }

        form.addEventListener('submit', processForm);

    });  
}

const editNote = (source) => {
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

const editTask = (source) => {
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

const showProject = (name) => {
    const buffer = manageTasks.global.read();
    const allTasks = buffer.tasks;
    const target = buffer.projects.find(item => item.techName === name);
    mainStateBuffer.get(name)
    display.show.project(target, allTasks);
}

const showInbox = () => {
    console.log('showInbox - run')
    const list = manageTasks.global.filter.inbox();
    console.log(`showInbox - list: ${list}`)
    mainStateBuffer.get('inbox');
    console.log('showInbox - buffered')
    display.show.inbox(list);
    console.log('showInbox - stop')
}

const showToday = () => {
    console.log('showToday - run')
    const list = manageTasks.global.filter.today();
    mainStateBuffer.get('today');
    display.show.today(list);
    console.log('showToday - stop')
}

const showThisWheek = () => {
    console.log('showThisWheek - run');
    const list = manageTasks.global.filter.thisWheek();
    mainStateBuffer.get('this-wheek');
    display.show.thisWheek(list);
    console.log('showThisWheek - stop');
}

const showTask = (name) => {
    const buffer = manageTasks.global.read();
    const target = buffer.tasks.find(item => item.techName === name);
    display.show.task(target);
}

const showNote = (name) => {
    const buffer = manageTasks.global.read();
    const target = buffer.notes.find(item => item.techName === name);
    display.show.note(target);
}

const showNotes = () => {
    console.log('showNotes - run');
    const list = manageTasks.global.filter.notes();
    mainStateBuffer.get('notes');
    display.show.notes(list);
    console.log('showNotes - stop');
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

const toggleCompleteCard = (source) => {
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

const close = () => {
    display.toggleCardScreen()
    display.refresh.cardScreen();
    updateMain();
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

    if (target.dataset.role === 'delete-note') {
        const name = target.dataset.source;
        removeNote(name);
    }

    if (target.dataset.role === 'edit-note') {
        const name = target.dataset.source;
        editNote(name);
    }

    if (target.dataset.role === 'note-name') {
        const name = target.dataset.source;
        showNote(name);
    }

    if (target.dataset.role === 'add-note-button') {
        createNote();
    }

    if (target.dataset.role === "add-task-button") {
        createTask();
    }

    if (target.dataset.role === 'label'
    && target.dataset.source === 'inbox' 
    || target.dataset.source === 'home') {
        showInbox();
    }

    if (target.dataset.role === 'label' 
    && target.dataset.source === 'today') {
        showToday();
    }

    if (target.dataset.role === 'label' 
    && target.dataset.source === 'this-wheek') {;
        showThisWheek();
    }

    if (target.dataset.role === 'label'
    && target.dataset.source === 'notes') {
        showNotes();
    }

    if (target.dataset.role === 'project-delete') {
        const name = target.dataset.source;
        removeProject(name);
    }

    if (target.dataset.role === 'project-edit') {
        const name = target.dataset.source;
        editProject(name);
    }

    if (target.dataset.role === 'card-mark-complete') {
        const name = target.dataset.source;
        toggleCompleteCard(name);
    }

    if (target.dataset.role === 'delete-task') {
        const name = target.dataset.source;
        removeTask(name);
    }

    if (target.dataset.role === 'edit-task') {
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

    if (target.dataset.role === 'add-button' 
    && target.dataset.source === 'projects') {
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

    if (target.dataset.role === 'label' 
    && target.dataset.source !== "inbox"
    && target.dataset.source !== "today"
    && target.dataset.source !== "this-wheek") {
        const name = target.dataset.source;
        display.dropdown(name);
    }
}

const pageStart = () => {
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
