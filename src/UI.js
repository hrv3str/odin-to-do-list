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

    const homeButton = nodeListMaker('home');
    const projectsButton = nodeListMaker('projects');
    const notesButton = nodeListMaker('notes');

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
            default: 
                break;
        }
    }

    return {
        handleMenus
    };
    
})();

export default display;