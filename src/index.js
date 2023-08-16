import 'normalize.css';
import './styles.css';

import {manageTasks} from './taskmanager.js';
//methods: 
//  'create(type, name, description, dueDate)',
//  'add(item, target)'
//  'remove(item)'
//  'isOutdated(item)'
//  'global.update()'
//  'global.read()'
//  'global.filter.inbox'
//  'global.filter.today'
//  'global.filter.thisWheek'
//  'global.filter.projects'
//  'global.filter.notes'
//  'global.filter.counters.inboxCount'
//  'global.filter.counters.thisWheekCount'
//  'global.filter.counters.todayCount'
//  'global.filter.counters.projectsCount'
//  'global.filter.counters.notesCount'

import storage from './storagemanager.js';
//methods: read(), write()

import display from './UI.js';
//methods:
    // handleMenus,
    // callCard(e, array),
    // callAddForm,
    // callEditForm(target),
    // hideCardFrame,
    // populateList,
    // nodeListHolder
const sidebar = document.getElementById('side-bar');

sidebar.addEventListener('click', display.handleMenus);
