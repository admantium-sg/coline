#!/usr/local/bin/node
const MysteryLunch = require('./index.js');
var mystl = new MysteryLunch();

// var testEvent = {
//    title: 'Mystery Lunch 1',
//    date: new Date('2018-11-01'),
//    participants: ['Sebastian', 'Janine'] 
// }; 

// mystl.addEvent(testEvent);

mystl.start();

