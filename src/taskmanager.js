import { format, startOfWeek, endOfWeek, isWithinInterval, isToday } from 'date-fns';

export const manageTasks = (() => {

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd-MM-yyyy');

    // IIFE to store data, with functions to read, update and filter it
    const global = (() => {

        //Declaring the container
        let container = {
            type: 'container',
            techName: 'global',
            tasks: [],
            projects: [],
            notes: []
        }

        // FUnction to update the container
        const update = (buffer) => {
            Object.assign(container, buffer);
            console.log(`${container.type} ${container.techName} is updated`);
        };

        // Function to read the container
        const read = () => {
            const buffer = {};
            buffer = {...container};
            console.log(`${container.type} ${container.techName} is read`);
            return buffer;
        }

        //IIFE containing filtering methods
        const filter = ((container) => {
            const filterByDueDate = (array, days) => {
                if (array.length < 0) {
                    return;
                }
                const currentDate = new Date();
                const filteredItems = array.filter(item => {
                  if (!item.dueDate) return false;
                  
                  const dueDate = new Date(item.dueDate);
                  const isInRange = days === 1 ? isToday(dueDate) : isWithinInterval(dueDate, { start: currentDate, end: new Date(currentDate.getTime() + (days * 24 * 60 * 60 * 1000)) });
                  
                  return isInRange;
                });
              
                return filteredItems;
              };
            
            // Ouput values
            const inbox = [...container.tasks]
            const thisWheek = filterByDueDate(inbox, 7);
            const today = filterByDueDate(inbox, 1);
            const projects = [...container.projects];
            const notes = [...container.notes];
            
            return {
                inbox,
                today,
                thisWheek,
                projects,
                notes
            };

        })();

        // Public methods for 'global'
        return {
            filter,
            update,
            read
        };
    })();


    // IIFE to create different items
    const create = (() => {
        // Creates techName using the pattern
        const utylize = (input) => {
            const output = input.slice(0, 8)
                        .toLowerCase()
                        .replace(/\W+/g, '-');

            const hash = () => {
                const min = 1;
                const max = 9999;
                const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                return randomNumber.toString().padStart(4, '0');
            };

            return output + `-${hash()}`;
        };

        const log = (target) => {
            console.log(`${target.type} ${target.techName} created`)
        }

        // Function to create task object
        const task = (name, description, dueDate, priority) => {
            const task = {
                type: 'task',
                name: name,
                techName: utylize(name),
                description: description,
                dueDate: format(dueDate, 'dd-MM-yyyy'),
                priority: priority,
                isComplete: false
            }

            log(task);
            return task;
        }
        
        // Function to create note object
        const note = (name, description) => {
            const note = {
                type: 'note',
                name: name,
                techName: utylize(name),
                description: description
            }

            log(note);
            return note
        }

        // Function to create project object
        const project = (name) => {
            const project = {
                type: 'project',
                name: name,
                techName: utylize(name),
                container: []
            }

            log(project);
            return project
        }

        // Public methods for 'create'
        return {
            task,
            note,
            project
        }
    })();

    const store = (object) => {
        const buffer = global.read();
        let log = ''

        switch (object.type) {
            case 'note':
                buffer.notes.push(object);
                log = 'Notes';
                break;
            case 'task':
                buffer.tasks.push(object);
                log = 'Tasks';
                break;
            case 'project':
                buffer.project.push(object);
                log = 'Projects';
                break;
            default:
                console.log('Cannot store, invalid argument');
                break;
        }
        
        global.update(buffer);

        console.log(`${object.type} ${object.techName} was added to ${log}`);
    };

    // finds item with the 'techName' and returns it or 'null' if item is missing
    const find = (techName, target) => {
        const result = Object.values(target)
            .flatMap(array => array)
            .find(item => item.techName === techName);
        
        if (result) {
            console.log(`Found a ${result.type} for ${techName}`)
            return result;
        } else {
            console.log(`Error! Found nothing for ${techName}`);
            return null;
        }
    }

    // Finds item with the 'techName' and removes it
    const remove = (techName) => {
        const buffer = global.read();
        
        const deletedItem = find(techName, buffer);

        if (deletedItem) {
                const key = Object.keys(buffer).find(key => buffer[key].includes(deletedItem));

            if (key) {
                const array = buffer[key];
                array.splice(array.indexOf(deletedItem), 1);
                global.update(buffer);
                console.log(`${deletedItem.type} ${deletedItem.techName} was removed from ${key}`);
            }
        }
    };

    // Finds item with the 'techName' and updates it with object
    const update = (techName, object) => {
        const buffer = global.read();
        const item = find(techName, buffer);

        if (item) {
            Object.assign(item, object);
            global.update(buffer);
            console.log(`${item.type} ${item.techName} was updated`);
        }
    }

    // Finds item with the 'techName' and passes it
    const locate = (techName) => {
        const buffer = global.read();
        const item = find(techName, buffer);
        return item;
    }

    // Links object to project specified with techName
    const linkToProject = (techName, object) => {
        const buffer = global.read();
        const item = find(techName, buffer);

        if (item && item.type === 'project') {
        const container = item.container;
        const link = object.techName;
        container.push(link);

        global.update(buffer);

        console.log(`${object.type} ${object.techName} was linked to ${item.type} ${item.techName}`)
        } else if (item) {
            console.log (`Failed to link ${object.type} ${object.techName}, ${item.type} ${item.techName} is not a project`)
        } else {
            console.log(`Failed to link ${object.type} ${object.techName}, project is missing`)
        }
    }

    // Get the list of items linked in project
    const getProjectList = (techName) => {
        const list = [];
        const buffer = global.read();

        const project = find(techName, buffer);

        if (project && project.type === 'project') {
            const links = project.container;
            links.forEach(link => {
                const item = find(link, buffer);
                list.push(item);
            });
            
            console.log(`Recovered items from ${project.type} ${project.techName} to the list`)
            return list;
        } else if (project) {
            console.log(`Failed to get list, ${item.type} ${item.techName} is not a project`);
        } else {
            console.log(`Failed to get list for ${techName}, project is missing`);
        }
    }
        
    return {
        global,
        create,
        store,
        remove,
        update,
        locate,
        linkToProject,
        getProjectList
    }

})();

const container = {
    read: global.read,
    update: global.update
}

export default container;