const element = (() => {
    // Generates different input forms
    const form = (() => {
        const formFrame = (title) => {
            const frame = document.createElement('form')
            frame.action = 'javascript:void(0)';

            const formTitle = document.createElement('h2')
            formTitle.textContent = title;

            formTitle.classList.add('form-header')
            frame.appendChild(formTitle);

            return frame;
        }

        const fieldName = () => {
            const fieldSet = document.createElement('fieldset');

            const fieldContent = `
                <label for="form-title">
                    Name:
                </label>
                <input type="text"
                    name="name"
                    id="form-title"
                    placeholder="Enter title"
                    required>
            `;

            fieldSet.innerHTML = fieldContent;

            return fieldSet;
        }

        const fieldDesc = () => {
            const fieldSet = document.createElement('fieldset');
            fieldSet.classList.add('description');

            const fieldContent = `
                <label for="form-description">
                    Description:
                </label>
                <textarea name="description"
                    id="form-description" 
                    cols="40" 
                    rows="15"
                    placeholder="Add description"></textarea>
            `;

            fieldSet.innerHTML = fieldContent;

            return fieldSet;
        }

        const fieldPrior = () => {
            const fieldSet = document.createElement('fieldset');

            const fieldContent = `
                <p>Priority:</p>
                <input type="radio"
                    name="priority"
                    id="priority-high"
                    value="high">
                <label for="priority-high"
                    class="mock-radio">
                    High
                </label>
                <input type="radio"
                    name="priority"
                    id="priority-normal"
                    value="normal"
                    >
                <label for="priority-normal"
                    class="mock-radio">
                    Normal
                </label>
                <input type="radio"
                    name="priority"
                    id="priority-low"
                    value="low">
                <Label for="priority-low"
                    class="mock-radio">
                    Low
                </Label>
            `;

            fieldSet.innerHTML = fieldContent;

            return fieldSet;
        }

        const fieldDate = () => {
            const fieldSet = document.createElement('fieldset');

            const fieldContent = `
                <label for="form-date">Due date:</label>
                <input type="date"
                    id="form-date"
                    name="dueDate"
                    required>
            `;

            fieldSet.innerHTML = fieldContent;

            return fieldSet;
        }

        const fieldSubmit = () => {
            const fieldSet = document.createElement('fieldset');

            const fieldContent = `
                <button type="submit"
                    value="no">
                        Cancel
                </button>
                <button type="submit"
                    value="yes">
                        Save
                </button>
            `;

            fieldSet.innerHTML = fieldContent;

            return fieldSet;
        }

        const project = (action) => {
            let frame;

            switch (action) {
                case 'create':
                    frame = formFrame('Create project');
                    break;
                case 'edit':
                    frame = formFrame('Edit project');
                    break;
            }

            const name = fieldName();
            frame.appendChild(name);

            const ok = fieldSubmit();
            frame.appendChild(ok);

            return frame;
        }

        const note = (action) => {
            let frame;

            switch (action) {
                case 'create':
                    frame = formFrame('Create note');
                    break;
                case 'edit':
                    frame = formFrame('Edit note');
                    break;
            }

            const name = fieldName()
            frame.appendChild(name);

            const desc = fieldDesc();
            frame.appendChild(desc);

            const ok = fieldSubmit();
            frame.appendChild(ok);

            return frame;
        }

        const task = (action) => {
            let frame;

            switch (action) {
                case 'create':
                    frame = formFrame('Create task');
                    break;
                case 'edit':
                    frame = formFrame('Edit task');
                    break;
            }

            const name = fieldName()
            frame.appendChild(name);

            const desc = fieldDesc();
            frame.appendChild(desc);

            const prior = fieldPrior();
            frame.appendChild(prior);

            const date = fieldDate();
            frame.appendChild(date);

            const ok = fieldSubmit();
            frame.appendChild(ok);

            return frame;
        }

        const popUp = () => {
            const body = document.createElement('form');
            body.action = 'javascript:void(0)'

            const bodyContent = `
                <h2 class="form-header">
                    Are you sure?
                </h2>
                <fieldset>
                    <button type="submit"
                        value="yes">
                            Yes
                    </button>
                    <button type="submit"
                        value="no">
                            No
                    </button>
                </fieldset>
            `;

            body.innerHTML = bodyContent;

            return body;
        }

        return {
            task,
            project,
            note,
            popUp
        }

    })();

    const task = (() => {
        const colorPick = (object) => {
            const priority = object.priority;
            let output = '';
            switch (priority) {
                case 'high':
                    output = 'red';
                    break;
                case 'normal':
                    output = 'yellow';
                    break;
                case 'low':
                    output = 'green';
                    break;
            }
            return output;
        }

        const getLineThrough = (object) => {
            const isComplete = object.isComplete;
            switch (isComplete) {
                case true:
                    return 'line-through';
                case false:
                    return '';
            }
        }

        const label = (object) => {
            const name = object.name;
            const source = object.techName;
            const dueDate = object.dueDate;
            const lineThrough = getLineThrough(object);
            const getChecked = () => {
                const isComplete = object.isComplete;
                switch (isComplete) {
                    case true:
                        return 'checked';
                    case false:
                        return '';
                }
            }
            const checked = getChecked();

            const body = document.createElement('div');
            body.classList.add('task-label');

            const bodyContent = `
                <div class="indicator"></div>
                <button
                    data-source="${source}"
                    data-role="task-name"
                    title="Show details"
                    class="${lineThrough}">
                        ${name}
                </button>
                <div class="task-date">
                    Due date: ${dueDate}
                </div>
                <input type="checkbox"
                    id="complete-${source}"
                    ${checked}>
                <label for="complete-${source}"
                    class="mock-checkbox control"
                    data-source="${source}"
                    data-role="mark-complete-button"
                    title="Mark complete">
                </label>
                <button data-source="${source}"
                    data-role="edit-task"
                    class="control edit"
                    title="Edit task">
                </button>
                <button data-source="${source}"
                    data-role="delete-task"
                    class="control delete"
                    title="Delete task">
                </button>
            `;
            
            body.innerHTML = bodyContent;

            const color = colorPick(object);

            const indicator = body.querySelector('div.indicator');

            indicator.classList.add(color);

            return body
        }

        const card = (object) => {
            const source = object.techName;
            const name = object.name;
            const desc = object.description;
            const color = colorPick(object);
            const dueDate = object.dueDate;
            const lineThrough = getLineThrough(object);
            const getCheckbox = () => {
                const isComplete = object.isComplete;
                switch (isComplete) {
                    case true:
                        return 'checkbox';
                    case false:
                        return 'uncheckbox';
                }
            }
            const checkbox = getCheckbox(object);

            const body = document.createElement('div');
            body.classList.add('card-body');
            body.dataset.source = source;

            const bodyContent = `
                <div class="card-header">
                    <div class="card-name ${lineThrough}">
                        ${name}
                    </div>
                    <button class="control edit"
                        title="Edit task"
                        data-source="${source}"
                        data-role="edit-task"></button>
                    <button class="control delete"
                        title="Close"
                        data-role="close-button"
                        data-source="${source}"></button>
                </div>
                <div class="card-description">
                    ${desc}
                </div>
                <div class="indicator ${color}">
                    <div class="card-date">
                        Due date: ${dueDate}
                    </div>
                </div>
                <div class="card-control-section">
                    <button data-source="${source}"
                        data-role="card-mark-complete"
                        title="Mark complete">
                            <span class="${checkbox}"
                                id="checkspan">
                            </span>
                            Mark complete
                    </button>
                    <button data-role="delete-task"
                        data-source="${source}"
                        title="Delete task">
                            <span class="delete"></span>
                            Delete task
                    </button>
                </div>
            `;

            body.innerHTML=bodyContent;
            return body;
        } 

        return {
            label,
            card
        }
    })();

    const project = (() => {
        //generates project label
        const label = (object) => { // Takes project object as argument
            const name = object.name; //Collects project data
            const source = object.techName
            const cutName = () => { //Generates name for HTML
                let cutUp = '';
                if (name.length > 10) {
                cutUp = name.slice(0, 10);
                cutUp += '...';
                return cutUp;
            } else {
                return name;
            }
            }

            const labelBody = document.createElement('div'); //Creates label body
            labelBody.classList.add('project-label');

            //Generates content according to gathered info
            const labelBodyContent = `
                <button class="control title"
                    title="View project"
                    data-source="${source}"
                    data-role="project-label">
                    ${cutName()}
                </button>

                <button class="control edit"
                    title="Edit project"
                    data-source="${source}"
                    data-role="project-edit">
                </button>

                <button class="control delete"
                    title="Delete project"
                    data-source="${source}"
                    data-role="project-delete"></button>
            `;

            labelBody.innerHTML = labelBodyContent;

            return labelBody //Returns label
        }

        // Creates frame for the main screen to display project
        const mainFrame = (object) => {
            const name = object.name;
            const source = object.techName;

            const body = document.createElement('div')
            body.classList.add('main-container')

            const bodyContent = `
                <div class="main-header">
                    <h2>
                        Project ${name}
                    </h2>
                        <button data-role="project-add-button"
                        data-source="${source}"
                        title="Add task to project">
                            add task
                    </button>
                </div>
                <div data-role="main-content"
                    data-source="${source}"
                    class="content">
                </div>
            `;

            body.innerHTML = bodyContent;
            return body //Returns frame
        }

        //Public methods
        return {
            label,
            mainFrame
        }

    })();

    const frames =(() => {
        const buildFrame = (title, button) => {
            const body = document.createElement('div');

            const toSpineCase = (input) => {
                return input.replace(/\s+/g, '-').toLowerCase();
            }

            const casedTitle = toSpineCase(title);
            body.classList.add('main-container');

            let buttonContent = ''

            if (!button) {
                buttonContent = '';
            }

            if (button && title !== 'Notes') {
                buttonContent = `
                    <button data-role="add-task-button"
                        data-source="${casedTitle}"
                        title="Add task">
                            add task
                    </button>
                `;
            }

            if (button && title === 'Notes') {
                buttonContent = `
                    <button data-role="add-note-button"
                        data-source="${casedTitle}"
                        title="Add note">
                            add note
                    </button>
                `;
            }

            const bodyContent = `
                <div class="main-header">
                    <h2>
                        ${title}
                    </h2>
                    ${buttonContent}
                </div>
                <div data-role="main-content"
                    data-source="${casedTitle}"
                    class="content">
                </div>
            `;

            body.innerHTML = bodyContent;

            return body //Returns frame
        }

        const inbox = () => {
            return buildFrame('Inbox', true);
        }
        const today = () => {
            return buildFrame('Today', false);
        };
        const thisWheek = () => {
            return buildFrame('This wheek', false);
        };
        const notes = () => {
            return buildFrame('Notes', true);
        };

        return {
            inbox,
            today,
            thisWheek,
            notes
        }

    })();

    const note = (() => {
        const label = (object) => {
            const title = object.name;
            const trimName = () => {
                if (title.length > 10) {
                    return title.substring(0, 10) + "...";
                  }
                  return title;
            }
            const description = object.description;
            const source = object.techName;
            const body = document.createElement('div');
            body.classList.add('note-label');

            const bodyContent = `
                <div class="note-title">
                    <button data-role="note-name"
                        data-source="${source}"
                        title="Show details">
                            ${trimName()}
                    </button>
                    <button class="control edit"
                        data-role="edit-note"
                        data-source="${source}"
                        title="Edit note">
                    </button>
                    <button class="control delete"
                        data-role="delete-note"
                        data-source="${source}"
                        title="Delete note">
                    </button>
                </div>
                <p class="note-description">
                    ${description}
                </p>
            `;

            body.innerHTML=bodyContent;
            return body;
        }

        const card = (object) => {
            const source = object.techName;
            const name = object.name;
            const desc = object.description;

            const body = document.createElement('div');
            body.classList.add('card-body');
            body.dataset.source = source;

            const bodyContent = `
                <div class="card-header">
                    <div class="card-name">
                        ${name}
                    </div>
                    <button class="control edit"
                        title="Edit note"
                        data-source="${source}"
                        data-role="edit-note"></button>
                    <button class="control delete"
                        title="Close"
                        data-role="close-button"
                        data-source="${source}"></button>
                </div>
                <div class="card-description">
                    ${desc}
                </div>
                <div class="card-control-section">
                    <button data-role="delete-note"
                        data-source="${source}"
                        title="Delete note">
                            <span class="delete"></span>
                            Delete note
                    </button>
                </div>
            `;

            body.innerHTML=bodyContent;
            return body;
        } 

        return {
            label,
            card
        }
    })();

    return {
        project,
        task,
        form,
        frames,
        note
    }
    
})();

export default element