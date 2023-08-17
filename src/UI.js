import element from './elements.js'
//methods:
//  addForm,
//  editForm(object),
//  taskCard(object),
//  projectLabel(object),
//  listItem(object)

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
        target.classList.remove('no-visible');
    }

    const collapse = (target) => {
        target.classList.remove('expand');
        target.classList.add('no-visible');
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
        const listName = nodeList.name
        const list = nodeList.list;
        const action = () => {};

        switch (listName) {
            case 'projects':
                action = element.projectLabel;
                break;
            default:
                action = element.listItem;
        }

        array.forEach((object) => {
            item = action(object);
            list.appendChild(item);
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
        const card = element.taskCard(object);
        showCardFrame(card);
        return(card);
    }

    const callAddForm = () => {
        const form = element.addForm();
        showCardFrame(form);
        return form;
    }

    const callEditForm = (target) => {
        const object = target;
        const form = element.editForm(object);
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
    };
    
})();

export default display;