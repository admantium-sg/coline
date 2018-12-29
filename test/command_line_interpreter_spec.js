var assert = require('chai').assert

var test_stdout = require('test-console').stdout
var test_stdin = require('mock-stdin').stdin()

const CommandLineInterpreter = require('./../model/index.js').CommandLineInterpreter
const MysteryLunch = require('./../demo/mystery_lunch.js').MysteryLunch

let cli = new CommandLineInterpreter()
cli.registerInterfaceObject(MysteryLunch)
cli.setup()

describe('CommandLineInterpreter', () => {
  var output = ''

  it("should print 'Mystery Lunch Planner' when started", () => {
    output = test_stdout.inspectSync(() => {
      cli.start()
    })
    match = /Mystery Lunch Planner/.test(output)
    assert.ok(match)
  })

  it("should show the prompt '$:'", () => {
    match = /\$:/.test(output)
    assert.ok(match)
  })
  it("should echo 'Hello!' when I enter 'Hello'", () => {
    output = test_stdout.inspectSync(() => {
      test_stdin.send('Hello!')
    })
    match = /\$>\ \'Hello!\'/.test(output)
    assert.ok(match)
  })
})
