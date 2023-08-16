import { format, startOfWeek, endOfWeek, isWithinInterval, isToday } from 'date-fns';

export const manageTasks = (() => {
    const utylize = (input) => {
        const output = input.slice(0, 8)
                    .toLowerCase()
                    .replace(/\W+/g, '-');

        const numberGen = () => {
            const min = 1;
            const max = 9999;
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            return randomNumber.toString().padStart(4, '0');
        };

        return output + `-${numberGen()}`;
    };

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'dd-MM-yyyy');

    const create = (type, name, description, dueDate, priority) => {
        const object =  {
            type: type,
            container: [],
            name: name,
            techName: utylize(name),
            description: description,
            creationDate: formattedDate,
            dueDate: dueDate,
            parent:'',
            complete: false,
            priority: priority
        };

        console.log(`${object.type} ${object.techName} created`)

        return object;
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
        const container = create('container', 'global-c', '', '');

        delete container.name;
        delete container.description;
        delete container.date;
        delete container.parent;
        delete container.complete;
        delete container.creationDate;
        delete container.dueDate
        delete container.priority

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

        const filter = ((container) => {
            const buffer = [...container.container];

            const filterType = (array, type) => {
                if (array.length < 0) {
                    return;
                }
                const tasks = array.filter(item => item.type === type);

                array.forEach(item => {
                    if (item.container && item.container.length > 0) {
                        const nestedTasks = filterType(item.container, type);
                        tasks.push(...nestedTasks);
                    };
                });

                return tasks
            };

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

            const inbox = filterType(buffer, 'task');
            const thisWheek = filterByDueDate(inbox, 7);
            const today = filterByDueDate(inbox, 1);
            const projects = filterType(buffer, 'project');
            const notes = filterType(buffer, 'note')

            const counters = (() => {
                const measure = (target) => {
                    return target.length;
                }

                const inboxCount = measure(inbox);
                const thisWheekCount = measure(thisWheek);
                const todayCount = measure(today);
                const projectsCount = measure(projects);
                const notesCount = measure(notes);

                return {
                    inboxCount,
                    thisWheekCount,
                    todayCount,
                    projectsCount,
                    notesCount
                }
                
            })();
            
            return {
                counters,
                inbox,
                today,
                thisWheek,
                projects,
                notes,
            };

        })(container);

        return {
            filter,
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