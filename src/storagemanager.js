import global from './taskmanager';

const storage = (() => {
    const key = 'ToDoList'

    const read = () => {
        const data = localStorage.getItem(key);
        global.update(data);
        console.log('loaded from local storage')
    }

    const write = () => {
        const data = JSON.stringify(global.read());
        localStorage.setItem(key,data);
        console.log('saved to local storage')
    }

    return {
        read,
        write
    }
})();

export default storage;