#!/usr/local/bin/mocha

var assert = require('assert');

var test_stdout = require('test-console').stdout;
var test_stdin = require('test-console').stdin;

const MysteryLunch = require('./index');
var mystl = new MysteryLunch();

console.log(mystl.start());

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
      it("should echo 'Hello!' when I enter 'Hello'")
   })
})
