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

    //generates project label
    const projectLabel = (object) => { // Takes project object as argument
        const name = object.name; //Collects project data
        const source = object.techName
        cutName = () => { //Generates name for HTML
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
                data-role="label">
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

    return {
        projectLabel,
        form
    }
    
})();

export default element