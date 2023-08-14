const display = (() => {
    const nodeListMaker = (name) => {
        const button = document.getElementById(name + '-button');
        const list = document.getElementById(name + '-list');
        const counter = document.getElementById(name + '-counter');
    
        const item = {
            button: button,
            list: list,
            counter: counter
        };

        return item;
    };

    const header = document.getElementById('header');
    const sideBar = document.getElementById('side-bar');
    const main = document.getElementById('main');
    const footer = document.getElementById('footer');

    const blurBackGround = () => {
        const blur = (target) => {
            target.classList.add('blur');
        };

        blur(header);
        blur(sideBar);
        blur(main);
        blur(footer);
    }

    const unBlurBackGround = () => {
        const unBlur = (target) => {
            target.classList.remove('blur');
        };

        blur(header);
        blur(sideBar);
        blur(main);
        blur(footer);
    };

    const homeButton = nodeListMaker('home');
    const projectsButton = nodeListMaker('projects');
    const notesButton = nodeListMaker('notes');
    const inboxButton = nodeListMaker('inbox');
    const todayButton = nodeListMaker('today');
    const thisWheekButton = nodeListMaker('this-wheek')

    const dropdown = (item) => {
        if(item.button.value === 'unchecked') {
            item.list.classList.add('expand');
            item.counter.classList.add('no-visible');
            item.button.value = 'checked';
        } else {
            item.list.classList.remove('expand');
            item.counter.classList.remove('no-visible')
            item.button.value = 'unchecked';
        };
    };

    const makeTaskItem = (tname, tdescription, tdueDate, tpriority, tisComplete) => {

        const title = tname;
        const description = tdescription;
        const dueDate = tdueDate;
        const priority = tpriority;
        const isComplete = tisComplete;

        const makeCard = (()=> {
            const cardBody = document.createElement('div');
            cardBody.classList.add('task-card');

            const cardTitle = document.createElement('h3');
            cardTitle.textContent = title;
            cardBody.appendChild.cardTitle;

            const editButton = document.createElement('button');
            editButton.title = 'Edit task';
            editButton.classList.add('control', 'edit');
            cardBody.appendChild(editButton);

            const closeButton = document.createElement('button');
            closeButton.title = 'Close';
            closeButton.classList.add('control delete');
            cardBody.appendChild(closeButton);

            const descPara = document.createElement('p');
            descPara.textContent = description;
            cardBody.appendChild(descPara);

            const indicator = document.createElement('div');
            indicator.classList.add('priority-indicator');
            switch (priority) {
                case 'high':
                    indicator.classList.add('red');
                    break;
                case 'normal':
                    indicator.classList.add('yellow');
                    break;
                case 'low':
                    indicator.classList.add('green');
                    break;
            }
            cardBody.appendChild(indicator);

            const dueDateTitle = document.createElement('h4');
            dueDateTitle.textContent = 'Due Date:';
            cardBody.appendChild.apply(dueDateTitle);

            const dueDateValue = document.createElement('div');
            dueDateValue.classList.add('date');
            dueDateValue.textContent = dueDate;
            cardBody.appendChild(dueDate);

            const completeTitle = document.createElement('h4');
            completeTitle.textContent = 'Complete';
            cardBody.appendChild(completeTitle);

            const completeCheckbox = document.createElement('button');
            completeCheckbox.classList.add('control', 'checkbox');
            completeCheckbox.title = 'Mark complete'
            if (isComplete) {
                completeCheckbox.classList.add('checked');
            }
            cardBody.appendChild(completeCheckbox);

            return cardBody;
        })(title, description, dueDate, priority, isComplete);

        const makeCardLabel = (() => {
            const labelBody = document.createElement('div');
            labelBody.classList.add('task-label');

            const nameButton = document.createElement('button');
            nameButton.classList.add('label-name');
            nameButton.textContent = title;
            labelBody.appendChild(nameButton);

            const editButton = document.createElement('button');
            editButton.classList.add('control', 'edit');
            labelBody.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('control', 'delete');
            labelBody.appendChild(deleteButton);

            return labelBody;
        })(title);
    };

    const handleMenus = (e) => {
        const target = e.target;
        console.log(`clicked on ${target.id}`);
        switch (target.id) {
            case 'home-button':
                dropdown(homeButton);
                break;
            case 'projects-button':
                dropdown(projectsButton);
                break;
            case 'notes-button':
                dropdown(notesButton);
                break;
            case 'inbox-button':
                dropdown(inboxButton);
                break;
            case 'today-button':
                dropdown(todayButton);
                break;
            case 'this-wheek-button':
                dropdown(thisWheekButton);
            default: 
                break;
        }
    }

    return {
        handleMenus
    };
    
})();

export default display;