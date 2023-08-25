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
                    checked>
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
                    name="dueDate">
            `;

            fieldSet.innerHTML = fieldContent;

            return fieldSet;
        }

        const fieldSubmit = () => {
            const fieldSet = document.createElement('fieldset');

            const fieldContent = `
                <button type="submit">OK</button>
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

        return {
            task,
            project,
            note
        }

    })();

    const task = (() => {
        const label = (object) => {
            const name = object.name;
            const source = object.techName;
            const dueDate = object.dueDate;
            const priority = object.priority;
            const isComplete = object.isComplete;
            const checked = () => {
                switch (isComplete) {
                    case true:
                        return 'checked';
                    case false:
                        return '';
                }
            }
            const lineThrough = () => {
                switch (isComplete) {
                    case true:
                        return 'line-through';
                    case false:
                        return '';
                }
            }

            const body = document.createElement('div');
            body.classList.add('task-label');

            const bodyContent = `
                <div class="indicator"></div>
                <button
                    data-source="${source}"
                    data-role="task-name"
                    title="Show details"
                    class="${lineThrough()}">
                        ${name}
                </button>
                <div class="task-date">
                    Due date: ${dueDate}
                </div>
                <input type="checkbox"
                    id="complete-${source}"
                    ${checked()}>
                <label for="complete-${source}"
                    class="mock-checkbox control"
                    data-source="${source}"
                    data-role="mark-complete button"
                    title="Mark complete">
                </label>
                <button data-source="${source}"
                    data-role="edit-button"
                    class="control edit"
                    title="Edit task">
                </button>
                <button data-source="${source}"
                    data-role="delete-button"
                    class="control delete"
                    title="Delete task">
                </button>
            `;
            
            body.innerHTML = bodyContent;

            const colorPick = () => {
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

            const color = colorPick();

            const indicator = body.querySelector('div.indicator');

            indicator.classList.add(color);

            return body
        }

        return {
            label
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
                    data-role="edit">
                </button>

                <button class="control delete"
                    title="Delete project"
                    data-source="${source}"
                    data-role="delete"></button>
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
                <div data-role="content"
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

    return {
        project,
        task,
        form
    }
    
})();

export default element