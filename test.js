#!/usr/local/bin/mocha
var assert = require('assert');

var test_stdout = require('test-console').stdout;
var test_stdin = require('mock-stdin').stdin();
var fs = require('fs');
const MysteryLunch = require('./index');
var mystl = new MysteryLunch();

describe("MysteryLunch", () => {
   describe("Startup and echoing 'Hello'", () => {
      var initial_output = test_stdout.inspectSync( () => {
         mystl.start();
      })

      it("should print 'Mystery Lunch Planner' when started", () => {
         match = /Mystery Lunch Planner/.test(initial_output);
         assert.ok(match);
      });
      
      it("should show the prompt '$:'", () => {
         match = /\$:/.test(initial_output);
         assert.ok(match);
      });
      it("should echo 'Hello!' when I enter 'Hello'", () => {
         var output = test_stdout.inspectSync( () => {
            test_stdin.send('Hello!');
         });
         //console.log(output);
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
      it("should start the creation of an event when I type 'manage events'", () => {
         var output = test_stdout.inspectSync( () => {
            test_stdin.send('manage events');
         });
         //console.log(output);
         match = /\$> Welcome to managing events\. What do you want to do\?/.test(output);
         assert.ok(match);
      })
   })
})
