import element from './elements.js'
//methods:
//  addForm,
//  editForm(object),
//  taskCard(object),
//  projectLabel(object),
//  listItem(object)

const display = (() => {
    
    const nodeListHolder = [];

    //creates node-list for groups of elements
    const nodeListCreator = (source) => {
        const label = document.querySelector(`[data-source="${source}"][data-role="label"]`);
        const menu = document.querySelector(`[data-source="${source}"][data-role="dropdown"]`);
        const content = document.querySelector(`[data-source="${source}"][data-role="content"]`);
        const counter = document.querySelector(`[data-source="${source}"][data-role="counter"]`);

        const nodeList = {
            name: source,
            label: label,
            menu: menu,
            content: content,
            counter: counter
        }

        return nodeList;
    }

    const nodeHome = nodeListCreator('home');
    nodeListHolder.push(nodeHome);

    const nodeProjects = nodeListCreator('projects')
    nodeListHolder.push(nodeProjects);

    const nodeNotes = nodeListCreator('notes');
    nodeListHolder.push(nodeNotes);

    const nodeInbox = nodeListCreator('inbox');
    delete nodeInbox.counter
    nodeListHolder.push(nodeInbox);

    const nodeToday = nodeListCreator('today');
    delete nodeToday.counter
    nodeListHolder.push(nodeToday);

    const nodeThisWheek = nodeListCreator('this-wheek');
    delete nodeThisWheek.counter;
    nodeListHolder.push(nodeThisWheek);

    const collapseAllNenus = () => {

        nodeListHolder.forEach((node) => {
            if(node.menu.classList.contains('expand')) {
                node.menu.classList.remove('expand')
            }

            if(!node.menu.classList.contains('no-visible')) {
                node.menu.classList.add('no-visible')
            }

            if(node.hasOwnProperty('counter')) {
                if (node.counter.classList.contains('no-visible')) {
                    node.counter.classList.remove('no-visible');
                }
            }
        })
    }

    const dropdown = (source) => {
        const nodeList = nodeListHolder.find(node => node.name === source);

        collapseAllNenus()

        nodeList.menu.classList.remove('no-visible');
        nodeList.menu.classList.add('expand');
        if(nodeList.hasOwnProperty('counter')) {
            nodeList.counter.classList.add('no-visible');
        }
    }

    return {
        dropdown,
    }
})();

export default display;