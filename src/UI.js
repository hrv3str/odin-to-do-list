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
        console.log('dropdown - run')
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
        console.log('toggleCardScreen - run')
        if (card) {
            header.classList.add('blur');
            aside.classList.add('blur');
            main.classList.add('blur');
            footer.classList.add('blur');
            cardScreen.classList.remove('no-visible');

            cardScreen.innerHTML = '';
            cardScreen.appendChild(card);
            
        } else if (!card) {
            cardScreen.innerHTML = '';
            header.classList.remove('blur');
            aside.classList.remove('blur');
            main.classList.remove('blur');
            footer.classList.remove('blur');
            cardScreen.classList.add('no-visible');
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

        const popUp = () => {
            return element.form.popUp();
        }

        return {
            edit,
            create,
            popUp
        }
    })();

    const refresh = (() => {
        const projects = (array) => {
            console.log('display.refresh.projects - run')
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
            div.innerHTML = '';
        }

        const main = () => {
            console.log('display.refresh.main - run');
            const main = document.querySelector('div.main');
            removeChildren(main);
            console.log('display.refresh.main - stop')
        }

        const cardScreen = () => {
            console.log('display.refresh.cardScreen - run')
            const cardScreen = document.querySelector('div.card-screen');
            removeChildren(cardScreen);
            console.log('display.refresh.cardScreen - stop')
        }

        const homeCounter = (array) => {
            console.log('display.refresh.homeCounter - run')
            const counter = nodeHome.counter;
            const count = array.length;
            counter.textContent = count;
            console.log(`display.refresh.homeCounter - stop. Count is ${count}.`)
        }

        const notesCounter = (array) => {
            console.log('display.refresh.notesCounter - run')
            const counter = nodeNotes.counter;
            const count = array.length;
            counter.textContent = count;
            console.log(`display.refresh.notesCounter - stop. Count is ${count}.`)
        }

        return {
            projects,
            main,
            cardScreen,
            homeCounter,
            notesCounter
        }
    })()

    const show = (() => {
        const populateFrame = (taskList, frame) => {
            const container = frame.querySelector('[data-role="main-content"]');

            taskList.forEach(task => {
                const label = element.task.label(task);
                container.appendChild(label);
            })
        }

        const populateNotesFrame = (taskList, frame) => {
            const container = frame.querySelector('[data-role="main-content"]');

            taskList.forEach(note => {
                const label = element.note.label(note);
                container.appendChild(label);
            })
        }

        const project = (object, inbox) => {
            console.log('show.project - run')
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
            refresh.main();
            main.appendChild(body)

            populateFrame(taskObjects, body);
        }

        const task = (object) => {
            console.log('show.task - run')
            const card = element.task.card(object)
            toggleCardScreen(card);
        }

        const inbox = (allTasks) => {
            console.log('show.inbox - run')
            console.log(`show.inbox - got list ${allTasks}`)
            const body = element.frames.inbox();
            console.log('show.inbox - got element')
            refresh.main();
            console.log('show.inbox - cleared "main"');
            main.appendChild(body);
            console.log('show.inbox - appended frame');
            populateFrame(allTasks, body);
            console.log('show.inbox - populated frame')
        }

        const today = (todayTasks) => {
            console.log('show.today - run')
            const body = element.frames.today();
            refresh.main()

            main.appendChild(body);
            populateFrame(todayTasks, body);
            console.log('show.today - stop')
        }

        const thisWheek = (thisWheekTasks) => {
            const body = element.frames.thisWheek();
            refresh.main()
        
            main.appendChild(body);
            populateFrame(thisWheekTasks, body);
        }

        const notes = (notes) => {
            console.log('display.show.notes - run');
            const body = element.frames.notes();

            refresh.main();
            main.appendChild(body);
            populateNotesFrame(notes, body);
            const content = document.querySelector('[data-role="main-content"]')
            content.classList.remove('content');
            content.classList.add('notes-holder');
            console.log('display.show.notes - stop');
        }

        const note = (object) => {
            console.log('display.show.note - run');
            const card = element.note.card(object);
            toggleCardScreen(card);
            console.log('display.show.note - stop')
        }

        return {
            project,
            task,
            inbox,
            today,
            thisWheek,
            notes,
            note
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