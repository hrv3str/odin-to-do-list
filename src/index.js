import 'normalize.css';
import './styles.css';
import {manageTasks} from './taskmanager.js';
//methods: 'create(type, name, description, dueDate)',
//         'add(item, target)'
//         'remove(item)'
//         'isOutdated(item)'
import storage from './storagemanager.js';
//methods: read(), write()