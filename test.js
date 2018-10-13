#!/usr/local/bin/mocha
// Prepare merge with branch A_event_emitter_redesign
var assert = require('assert');

var test_stdout = require('test-console').stdout;
var test_stdin = require('mock-stdin').stdin();
var fs = require('fs');
const MysteryLunch = require('./index').MysteryLunch;
var mystl = new MysteryLunch();

var testEvent = {
   title: 'Mystery Lunch 1',
   date: new Date('2018-11-01'),
   participants: ['Sebastian', 'Janine'] 
}; 

describe("MysteryLunch", () => {
   describe("Startup and echoing 'Hello'", () => {
      var output = "";
   
      it("should print 'Mystery Lunch Planner' when started", () => {
         output = test_stdout.inspectSync( () => {
            mystl.start();
         })
         match = /Mystery Lunch Planner/.test(output);
         assert.ok(match);
      });
      
      it("should show the prompt '$:'", () => {
         match = /\$:/.test(output);
         assert.ok(match);
      });
      it("should echo 'Hello!' when I enter 'Hello'", () => {
         output = test_stdout.inspectSync( () => {
            test_stdin.send('Hello!');
         });
         console.log(output);
         match = /\$>\ \'Hello!\'/.test(output);
         assert.ok(match);
      });  
      it("should log all commands in the logfile", () => {
         var logfile_content = fs.readFileSync('./mystl.log', 'utf-8');
         
         //Expect Myster Lunch PLanner at the beginning
         match = /^Mystery Lunch Planner\s/.test(logfile_content);
         assert.ok(match);

         match = /\$: Hello!/.test(logfile_content);
         assert.ok(match);

         match = /\$> 'Hello!'/.test(logfile_content);
         assert.ok(match);

         //Expect Prompt and space at the end of the file
         match = /\$:\s$/.test(logfile_content);
         assert.ok(match);
      })
   })
   describe("Managaging events", () => {
      var output = "foo"
      it("should start the creation of an event when I type 'manage events'", () => {
         output = test_stdout.inspectSync( () => {
            test_stdin.send('M');
         });
         //console.log(output);
         match = /\$> Welcome to managing events\. What do you want to do\?/.test(output);
         assert.ok(match);
      })
      it("should show the options 'Create New Event' and 'Show all events'", () => {
         match = /Create new event/.test(output);
         assert.ok(match);

         match = /Show all events/.test(output);
         assert.ok(match);
      })
      it("should show a test event with title = Mystery Lunch 1, date = 01.11.2018 and particapant = Sebastian, Janine", () => { 
         mystl.addEvent(testEvent);

         output = test_stdout.inspectSync( () => {
            test_stdin.send('S');
         });
         
         match = /Mystery Lunch 1/.test(output);
         assert.ok(match);

         match = /2018-11-01/.test(output);
         assert.ok(match)

         match = /Sebastian,Janine/.test(output);
         assert.ok(match);
      })
      it("should create a new event by asking me a set of questions", () => {
         output = test_stdout.inspectSync( () => {
            test_stdin.send('C');
            test_stdin.send('My First Mystery Lunch');
            test_stdin.send('2018-11-05');
            test_stdin.send('Sebastian, Janine');
         });
         console.log(output);
      })
   })
})
