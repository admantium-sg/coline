var assert = require('chai').assert

var test_stdout = require('test-console').stdout
var test_stdin = require('mock-stdin').stdin()

const CommandLineInterpreter = require('../model/index').CommandLineInterpreter
const MysteryLunch = require('../app/mystery_lunch').MysteryLunch

let cli = new CommandLineInterpreter()
cli.registerInterfaceObject(MysteryLunch)
cli.setup()

describe('MysteryLunch Interface Object', () => {
  var output = ''
  it("should print 'Welcome to managing events' when I start the application", () => {
    output = test_stdout.inspectSync(() => {
      cli.start()
    })
    match = /> Welcome to managing lunch events\. What do you want to do\?/.test(output)
    assert.ok(match)
  })
  it("should show the options 'Create New Event' and 'Show all events'", () => {
    match = /Create new event/.test(output)
    assert.ok(match)

    match = /Show all events/.test(output)
    assert.ok(match)
  })
  it('should create a new event by asking me a set of questions', () => {
    output = test_stdout.inspectSync(() => {
      test_stdin.send('C')
    })
    match = /What is the name of the event\?/.test(output)
    assert.ok(match)

    output = test_stdout.inspectSync(() => {
      test_stdin.send('My First Mystery Lunch')
      test_stdin.send('2018-11-05')
    })
    match = /Who is participating\?/.test(output)
    assert.ok(match)
  })
  it("should ask me for confirmation before finishing the object creation", () => {
    output = test_stdout.inspectSync(() => {
      test_stdin.send('Sebastian, Caro')
    })
    match = /Do you want to create this event\?/.test(output)
    assert.ok(match)
  })
  it('should print the event with the data I just entered', () => {
    output = test_stdout.inspectSync(() => {
      test_stdin.send('R')
    })

    match = /My First Mystery Lunch/.test(output)
    assert.ok(match)

    match = /2018-11-05/.test(output)
    assert.ok(match)

    match = /Sebastian, Caro/.test(output)
    assert.ok(match)
  })
})
