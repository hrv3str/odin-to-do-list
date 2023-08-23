import element from './elements.js'
//methods:
//  projectLabel(object),


const display = (() => {
    const cardScreen = document.querySelector('div.card-screen');
    const projectLabelHolder = document.querySelector(`[data-source="projects"][data-role="content"]`);
    const header = document.querySelector('div.header');
    const aside = document.querySelector('div.aside');
    const main = document.querySelector('div.main');
    const footer = document.querySelector('div.footer');
    
    const nodeListHolder = []; //Array to hold nodelists

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
    delete nodeNotes.menu;
    nodeListHolder.push(nodeNotes);
    
    const collapseAllNenus = () => {

        nodeListHolder.forEach((node) => {
            if (node.hasOwnProperty('menu')) {
                if(node.menu.classList.contains('expand')) {
                    node.menu.classList.remove('expand')
                }

                if(!node.menu.classList.contains('no-visible')) {
                    node.menu.classList.add('no-visible')
                }
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

        if (nodeList.hasOwnProperty('menu')) {
            nodeList.menu.classList.remove('no-visible');
            nodeList.menu.classList.add('expand');
        };

        if(nodeList.hasOwnProperty('counter')) {
            nodeList.counter.classList.add('no-visible');
        }
    }

    const toggleCardScreen = () => {
        header.classList.toggle('blur');
        aside.classList.toggle('blur');
        main.classList.toggle('blur');
        footer.classList.toggle('blur');
        cardScreen.classList.toggle('no-visible');
    }

    return {
        dropdown,
        toggleCardScreen
    }
})();

export default display;