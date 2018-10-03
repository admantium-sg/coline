#!/usr/local/bin/mocha

var assert = require('assert');
var test_stdout = require('test-console').stdout;
var mystl = require('./index');

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
      })
   })
})
