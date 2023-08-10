import { format } from 'date-fns';

export const manageTasks = (() => {
    const utylize = (input) => {
        return input.slice(0, 8)
                    .toLowerCase()
                    .replace(/\W+/g, '-');
    };

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd-MM-yyyy');

    const create = (type, name, description, dueDate) => {
        const object =  {
            type: type,
            container: [],
            name: name,
            techName: utylize(name),
            description: description,
            creationDate: formattedDate,
            dueDate: dueDate,
            parent:'',
            complete: false
        };

        console.log(`${object.type} ${object.techName} created`)
    };

    const add = (object, target) => {
        target.container.push(object);
        object.parent = target;

        console.log(`${object.type} ${object.techName} was added to ${target.type} ${target.techName}`);
        console.log(`${target.type} ${target.techName} is now ${JSON.stringify(target.container)}`)
    };

    const remove = (object) => {
        const parent = object.parent;
        parent.container = parent.container.filter(child => child !== object);
        console.log(`${object.type} ${object.techName} was removed from ${parent.type} ${parent.techName}`);
    };

    const isOutdated = (object) => {
        if (object.dueDate < currentDate) {
            return true;
        } else {
            return false;
        }
    };

    const global = (() =>{
        const container = create('global-c', '', 'container');

        delete container.name;
        delete container.description;
        delete container.date;
        delete container.parent;
        delete container.complete;
        delete container.creationDate;
        delete container.dueDate

        const update = (arr) => {
            container.container = [];
            container.container = [...arr];
            console.log(`${container.type} ${container.techName} is updated`);
        };

        const read = () => {
            const transContainer = [...container.container];
            console.log(`${container.type} ${container.techName} is read`);
            return transContainer;
        }

        return {
            update,
            read
        };
    })();

    return {
        global,
        create,
        add,
        remove,
        isOutdated
    }
})();

const global = {
    read: manageTasks.global.read,
    update: manageTasks.global.update
}

export default global;