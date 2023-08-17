const element = (() => {
    // Translates 'opject.priority' into class color
    const indicatorColor = (priority) => {
            switch (priority) {
                case 'high':
                    return 'red';
                case 'normal':
                    return 'yellow';
                case 'low':
                    return 'green';
            }
        }
    
    // Returns form for adding items
    const addForm = () => {
        const form = document.createElement('form');
        const formContent = `
        <label for="title-input">Title</label>
        <input type="text"
            name="title"
            id="title-input"
            placeholder="Enter the title"
            required>
        <legend>
            Choose type:
            <input type="radio"
                id="type-task"
                name="type"
                value="task"
                checked>
            <label for="type-task"
                class="mock-radio">
                    Task
            </label>
            <input type="radio"
                id="type-project"
                name="type"
                value="project">
            <label for="type-project"
                class="mock-radio">
                    Project
            </label>
            <input type="radio"
                id="type-note"
                name="type"
                value="note">
            <label for="type-note"
                class="mock-radio">
                    Note
            </label>
        </legend>
        <label for="task-desc">Description</label>
        <textarea name="description"
            id="task-desc"
            cols="110"
            rows="10"
            placeholder="Give the description">
        </textarea>
        <legend>
            Choose priority:
            <input type="radio"
                id="priority-low"
                name="priority"
                value="low"/>
            <label for="priority-low"
                class="mock-radio">
                    Low
            </label>
            <input type="radio"
                id="priority-normal"
                name="priority"
                value="normal"
                checked/>
            <label for="priority-normal"
                class="mock-radio">
                    Normal
            </label>
            <input type="radio"
                id="priority-high"
                name="priority"
                value="high"/>
            <label for="priority-high"
                class="mock-radio">
                    High
            </label>
        </legend>
        <label for="task-date">Due date</label>
        <input type="date"
            id="task-date"
            name="date">
        <button type="submit">Add task</button>
        `;

        form.classList.add('form');
        form.action = 'javascript:void(0)';
        form.innerHTML = formContent;

        return form;
    }

    // Returns form for editing, prepopulated according to object
    const editForm = (object) => {
        const form = document.createElement('form');
        const formContent = `
        <label for="title-input">Title</label>
        <input type="text"
            name="title"
            id="title-input"
            placeholder="Enter the title"
            required>
        <label for="task-desc">Description</label>
        <textarea name="description"
            id="task-desc"
            cols="110"
            rows="10"
            placeholder="Give the description">
        </textarea>
        <legend>
            Choose priority:
            <input type="radio"
                id="priority-low"
                name="priority"
                value="low"/>
            <label for="priority-low"
                class="mock-radio">
                    Low
            </label>
            <input type="radio"
                id="priority-normal"
                name="priority"
                value="normal"
                checked/>
            <label for="priority-normal"
                class="mock-radio">
                    Normal
            </label>
            <input type="radio"
                id="priority-high"
                name="priority"
                value="high"/>
            <label for="priority-high"
                class="mock-radio">
                    High
            </label>
        </legend>
        <label for="task-date">Due date</label>
        <input type="date"
            id="task-date"
            name="date">
        <button type="submit"
            id='form-submit'>
                Add task
        </button>
        `;

        form.classList.add('form');
        form.action = 'javascript:void(0)';
        form.innerHTML = formContent;

        const getElement = (id) => {
            return document.getElementById(id);
        }

        const titleField = getElement('title-input')
        const descField = getElement('task-desc');
        const radioLow = getElement('priority-low');
        const radioNormal = getElement('priority-normal');
        const radioHigh = getElement('priority-high');
        const dateField = getElement('task-date');

        titleField.value = object.name;
        descField.value = object.description;

        const check = (target) => {
            target.checked = true;
        }

        switch (object.priority) {
            case 'low':
                check(radioLow);
                break;
            case 'normal':
                check(radioNormal);
                break;
            case 'high':
                check(radioHigh);
                break;
        }

        dateField.value = object.dueDate;

        return form;
    }

    // Returns task card
    const taskCard = (object) => {
        const title = object.name;
        const description = object.description;
        const dueDate = object.dueDate;
        const priority = object.priority;
        const isComplete = object.isComplete;
        const techName = object.techName;

        const color = indicatorColor(priority);

        const card = document.createElement('div');
        card.classList.add('task-card');
        card.id = techName + '-card';
        
        const cardContent = `
            <h3>${title}</h3>
            <button title="Edit task"
                class="control edit"
                id="${techName}-edit"></button>
            <button title="Close"
                class="control delete"
                id="${techName}-close"></button>
            <p>${description}</p>
            <div class="priority-indicator ${color}"></div>
            <h4>Due Date:</h4>
            <div class="date">${dueDate}</div>
            <h4>Complete</h4>
            <button title="Mark complete"
                class="control checkbox ${isComplete ? 'checked' : ''}"
                id="${techName}-complete">
            </button>
        `;

        card.innerHTML = cardContent;
        return card;
    }

    // Returns project label
    const projectLabel = (object) => {
        const title = object.name;
        const techName = object.techName;

        const label = document.createElement('div');
        label.classList.add('task-label');

        const labelContent = `
            <button class="label-name"
                id="${techName}-button">${title}</button>
            <button class="control edit"
                title="Edit project"
                id="${techName}-edit">
            </button>
            <button class="control delete"
                title="Delete project"
                id="${techName}-delete"></button>
        `;

        label.innerHTML = labelContent;
        return label;
    }

    // Returns list item
    const listItem = (object) => {
        const title = object.name;
        const description = object.description;
        const dueDate = object.dueDate;
        const priority = object.priority;
        const isComplete = object.isComplete;
        const techName = object.techName;

        const color = indicatorColor(priority);

        const item = document.createElement('div');
        item.classList.add('list-element');
        item.id = techName + '-item';

        const itemContent = `
            <div class="list-indicator ${color}"></div>
            <p>${title}</p>
            <p>${description}</p>
            <p>${dueDate}</p>
            <button class="control details"
                title="Show details"
                id="${techName}">
                    Details
            </button>
            <button class="control checkbox ${isComplete ? 'checked' : ''}" 
                title="Mark complete"
                id="${techName}-complete">
            </button>
            <button class="control edit"
                title="Edit task"
                id="${techName}-edit">
            </button>
            <button class="control delete"
                title="Delete task">
                id="${techName}-delete"
            </button>
        `;

        item.innerHTML = itemContent;
        return item;
    }

    // Public methods
    return {
        addForm,
        editForm,
        taskCard,
        projectLabel,
        listItem
    }
    
})();

export default element