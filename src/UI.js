import element from './elements.js'
//methods:
//  projectLabel(object),


const display = (() => {
    const cardScreen = document.querySelector('div.card-screen');
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

        if ('menu' in nodeList) {
            nodeList.menu.classList.remove('no-visible');
            nodeList.menu.classList.add('expand');
        };

        if('counter' in nodeList) {
            nodeList.counter.classList.add('no-visible');
        }
    }

    const toggleCardScreen = (card) => {
        header.classList.toggle('blur');
        aside.classList.toggle('blur');
        main.classList.toggle('blur');
        footer.classList.toggle('blur');
        cardScreen.classList.toggle('no-visible');

        if (!cardScreen.classList.contains('no-visible') && card) {
            cardScreen.appendChild(card);
        } else if (card) {
            refresh.cardScreen();
        }
    }

    const form = (() => {
        const edit = (() => {
            const project = () => {
                return element.form.project('edit');
            }

            const note = () => {
                return element.form.note('edit');
            }

            const task = () => {
                return element.form.task('edit')
            }

            return {
                task,
                project,
                note
            }
        })()

        const create = (() => {
            const project = () => {
                return element.form.project('create');
            }

            const note = () => {
                return element.form.note('create');
            }

            const task = () => {
                return element.form.task('create')
            }

            return {
                task,
                project,
                note
            }
        })()

        return {
            edit,
            create
        }
    })();

    const refresh = (() => {
        const projects = (array) => {
            const section = nodeListHolder.find (item => item.name === 'projects');
            const container = section.content
            container.innerHTML = '';
            array.forEach(object => {
                const label = element.project.label(object);
                container.appendChild(label)
            })
            const counter = section.counter;
            const count = array.length;
            counter.textContent = count;
        }

        const removeChildren = (div) => {
            while (div.firstChild) {
                div.removeChild(div.firstChild);
              }
        }

        const main = () => {
            const main = document.querySelector('div.main');
            removeChildren(main);
        }

        const cardScreen = () => {
            const cardScreen = document.querySelector('div.card-screen');
            removeChildren(cardScreen);
        }

        return {
            projects,
            main,
            cardScreen
        }
    })()

    const show = (() => {
        const project = (object, inbox) => {
            const allTasks = [...inbox];
            const linkedTasks = [...object.container];
            const taskObjects = []
            linkedTasks.forEach(link => {
                const target = allTasks.find(item => item.techName === link);
                if (target) {
                    taskObjects.push(target);
                } else {
                    return
                }
            })

            const body = element.project.mainFrame(object);
            const container = body.querySelector(`[data-role="content"]`);

            taskObjects.forEach(object => {
                const label = element.task.label(object)
                container.appendChild(label)
            });

            refresh.main();

            main.appendChild(body)
        }

        const task = (object) => {
            const card = element.task.card(object)
            toggleCardScreen(card);
            return card;
        }

        return {
            project,
            task
        }

    })()

    return {
        dropdown,
        toggleCardScreen,
        form,
        refresh,
        show
    }
})();

export default display;