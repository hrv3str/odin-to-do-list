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
        const button = document.querySelector(`[data-source="${name}"][data-role="button"]`);
        const list = document.querySelector(`[data-source="${name}"][data-role="list"]`);
        const counter = document.querySelector(`[data-source="${name}"][data-role="counter"]`);
        const content = document.querySelector(`[data-source="${name}"][data-role="content"]`);
    
        const item = {
            name: name,
            button: button,
            list: list,
            counter: counter,
            content: content
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

    const clear = (element) => { //Removes all children
        while (element.childElementCount > 0) {
            element.removeChild(element.firstChild);
        };
    };

    const dropdown = (name) => {
        const item = nodeListHolder.find(item => item.name === name);

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

    const addProjectList = (element) => {
        const source= element.dataset.source;

        const listId = source + '-list';

        const list = create('div', 'main-list');
        list.classList.add('no-visible');
        list.id = listId;
        list.dataset.source = source;
        list.dataset.role = 'list'

        const listContent = `
            <button
                class="control add"
                data-source="${source}"
                data-role="add-button">
                    Add task
            </button>
        `;
        list.innerHTML = listContent
        
        main.appendChild(list);
        const nodeList = nodeListMaker(source);
        console.log({nodeList});
        console.log({nodeListHolder});
    }

    const populateList = (array, name) => {
        const nodeList = nodeListHolder.find(item => item.name === name);
        const listName = nodeList.name
        const list = nodeList.content;
        let action = () => {};

        clear(list);

        switch (listName) {
            case 'projects':
                action = element.projectLabel;
                break;
            default:
                action = element.listItem;
        }

        array.forEach((object) => {
            const item = action(object);
            list.appendChild(item);
            if (listName === 'projects') {
                addProjectList(item);
                console.log({item})
                console.log(`Hooked list to ${item}`)
            }
        });
    };

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

    const updateCounter = (count, name) => {
        const nodeList = nodeListHolder.find(item => item.name === name);
        const counter = nodeList.counter;
        counter.textContent = count;
    }

    return {
        dropdown,
        callCard,
        callAddForm,
        callEditForm,
        hideCardFrame,
        populateList,
        updateCounter,
        clear
    };
    
})();

export default display;