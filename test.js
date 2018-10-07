#!/usr/local/bin/mocha
//Prepare merge with branch "03_log_complete_session_in_file"
var assert = require('assert');

var test_stdout = require('test-console').stdout;
var test_stdin = require('mock-stdin').stdin();
const MysteryLunch = require('./index');
var mystl = new MysteryLunch();

describe("MysteryLunch", () => {
   describe("#start()", () => {
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
         console.log(output);
         match = /\$>\ \'Hello!\'/.test(output);
         assert.ok(match);
      });  
   })
})
