import elements from './elements.js'
//methods:
//  addForm()
//  editForm(target)

const display = (() => {

    const nodeListHolder = [];

    const nodeListMaker = (name) => {
        const button = document.getElementById(name + '-button');
        const list = document.getElementById(name + '-list');
        const counter = document.getElementById(name + '-counter');
    
        const item = {
            name: name,
            button: button,
            list: list,
            counter: counter
        };

        nodeListHolder.push(item);

        return item;
    };

    const header = document.getElementById('header');
    const sideBar = document.getElementById('side-bar');
    const main = document.getElementById('main');
    const footer = document.getElementById('footer');

    const cardHolder = document.getElementById('card-holder');

    const homeButton = nodeListMaker('home');
    const projectsButton = nodeListMaker('projects');
    const notesButton = nodeListMaker('notes');
    const inboxButton = nodeListMaker('inbox');
    const todayButton = nodeListMaker('today');
    const thisWheekButton = nodeListMaker('this-wheek')

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

        unBlur(header);
        unBlur(sideBar);
        unBlur(main);
        unBlur(footer);
    };

    const create = (element, className) => {
        const item = document.createElement(element);
        item.classList.add(className);
        return item;
    };

    const show = (target) => {
        target.classList.remove('no-visible');
    }

    const hide = (target) => {
        target.classList.add('no-visible');
    }

    const expand = (target) => {
        target.classList.add('expand');
    }

    const collapse = (target) => {
        target.classList.remove('expand');
    }

    const dropdown = (item) => {
        if(item.button.value === 'unchecked') {
            expand(item.list);
            hide(item.counter);
            item.button.value = 'checked';
        } else {
            collapse(item.list);
            show(item.counter);
            item.button.value = 'unchecked';
        };
    };

    const indicatorValue = (priority, target) => {
        switch (priority) {
            case 'high':
                target.classList.add('red');
                break;
            case 'normal':
                target.classList.add('yellow');
                break;
            case 'low':
                target.classList.add('green');
                break;
        }
    }

    const make = (object) => {

        const title = object.name;
        const description = object.description;
        const dueDate = object.dueDate;
        const priority = object.priority;
        const isComplete = object.isComplete;
        const type = object.type;
        const techName = object.techName;

        const card = ()=> {
            const cardBody = document.createElement('div');
            cardBody.classList.add('task-card');
            cardBody.id = techName + '-card';

            const cardTitle = document.createElement('h3');
            cardTitle.textContent = title;
            cardBody.appendChild(cardTitle);

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
            indicatorValue(priority, indicator);
            cardBody.appendChild(indicator);

            const dueDateTitle = document.createElement('h4');
            dueDateTitle.textContent = 'Due Date:';
            cardBody.appendChild(dueDateTitle);

            const dueDateValue = document.createElement('div');
            dueDateValue.classList.add('date');
            dueDateValue.textContent = dueDate;
            cardBody.appendChild(dueDateValue);

            const completeTitle = document.createElement('h4');
            completeTitle.textContent = 'Complete';
            cardBody.appendChild(completeTitle);

            const completeCheckbox = document.createElement('button');
            completeCheckbox.classList.add('control', 'checkbox');
            completeCheckbox.title = 'Mark complete'
            if (isComplete) {
                cardBody.classList.add('checked');
            }
            cardBody.appendChild(completeCheckbox);

            return cardBody;
        };

        const label = () => {
            const labelBody = document.createElement('button');
            labelBody.classList.add('task-label');
            labelBody.id = techName + '-button';

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
        };

        const listItem = () => {
            const listItemBody = document.createElement('div');
            listItemBody.classList.add('list-element');
            cardBody.id = techName + '-item';

            const listIndicator = document.createElement('div');
            listIndicator.classList.add('list-indicator');
            indicatorValue(priority, listIndicator);
            listItemBody.appendChild(listIndicator);

            const listName = document.createElement('p');
            listName.textContent = title;
            listItemBody.appendChild(listName);

            const listDesc = document.createElement('p');
            listDesc.textContent = description;
            listItemBody.appendChild(listDesc);

            const listDueDate = document.createElement('p');
            listDueDate.textContent = dueDate;
            listItemBody.appendChild(listDueDate);

            const listDetails = create('button', 'control');
            listDetails.classList.add('details');
            listDetails.text.content = 'Details';
            listDetails.title = 'Show details';
            listDetails.id = techName;
            listItemBody.appendChild(listDetails);

            const listIsComplete = create('button', 'control');
            listIsComplete.classList.add('checkbox');
            listIsComplete.title = 'Mark complete'
            if (isComplete) {
                listItemBody.classList.add('checked');
            }
            listItemBody.appendChild(listIsComplete);

            const listEdit = create('button', 'control');
            listEdit.classList.add('edit');
            listEdit.title = 'Edit task';
            listItemBody.appendChild(listEdit);

            const listDelete = create('button', 'control');
            listDelete.classList.add('edit');
            listDelete.title = 'Delete task';
            listItemBody.appendChild(listDelete);

            return listItemBody;
        }

        return {
            card,
            label,
            listItem
        }

    };

    const addProjectList = (label) => {
        const labelId = label.id;
        const name = labelId.replace('-label', ' ');
        const listId = labelId.replace('-label', '-list');

        const list = create('div', 'main-list');
        list.id = listId;
        
        main.appendChild(list);
        const nodeList = nodeListMaker(name);
    }

    const populateList = (array, nodeList) => {
        array.forEach(object => {
            const item = make(object);
            switch (nodeList.list.id) {
                case 'project-list':
                    nodeList.list.appendChild(item.label);
                    addProjectList(item.label);
                    break;
                default:
                    nodeList.list.appendChild(item.listItem);
                    break;
            }
        })
    }

    const showCardFrame = (card) => {
        blurBackGround();
        show(cardHolder);
        cardHolder.appendChild(card);
    }

    const hideCardFrame = (card) => {
        cardHolder.removeChild(card);
        hide(cardHolder);
        unBlurBackGround();
    }

    const callCard = (e, array) => {
        const techName = e.target.id;
        const object = array.find(obj => obj.techName = techName);
        const item = make(object);
        const card = item.card;
        showCardFrame(card);
        return(card);
    }

    const callAddForm = () => {
        const form = elements.addForm();
        showCardFrame(form);
        return form;
    }

    const callEditForm = (target) => {
        const object = target;
        const form = elements.editForm(object);
        showCardFrame(form);
        return form
    }

    const handleMenus = (e) => {
        const target = e.target;
        console.log(`clicked on ${target.id}`);

        const name = target.id.replace('-button', '');
        const nodeList = nodeListHolder.find(item => item.name === name);

        dropdown(nodeList);
    }

    return {
        handleMenus,
        callCard,
        callAddForm,
        callEditForm,
        hideCardFrame,
        populateList,
        nodeListHolder
    };
    
})();

export default display;