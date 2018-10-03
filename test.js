#!/usr/local/bin/mocha

var assert = require('assert');
var test_stdout = require('test-console').stdout;
const MysteryLunch = require('./index');
var mystl = new MysteryLunch();

console.log(mystl.start());

function start() {
   console.log('Mystery Lunch Planner');
}

describe("MysteryLunch", () => {
   describe("#start()", () => {
      it("should print 'Mystery Lunch Planner' when started", () => {
         var output = test_stdout.inspectSync(() => {
            mystl.start();
         })
         assert.equal(output,"Mystery Lunch Planner");
      });
      it("should show the prompt '$:'", () => {
         var output = test_stdout.inspectSync( () => {
            mystl.session();
         })
         assert.equal(output, "$: ");
      });
   })
})
