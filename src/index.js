import 'normalize.css';
import './styles.css';

import {manageTasks} from './taskmanager.js';
//methods: 'create(type, name, description, dueDate)',
//         'add(item, target)'
//         'remove(item)'
//         'isOutdated(item)'

import storage from './storagemanager.js';
//methods: read(), write()

import display from './UI.js';
//methods: handleMenus()

const sidebar = document.getElementById('side-bar');

sidebar.addEventListener('click', display.handleMenus);