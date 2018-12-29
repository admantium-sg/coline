var assert = require('chai').assert

var test_stdout = require('test-console').stdout
var test_stdin = require('mock-stdin').stdin()

const InterfaceObject = require('./../model/index.js').InterfaceObject
const CommandHandler = require('./../model/index.js').CommandHandler
const interface_mock = [
  {
    key: "C",
    message: "Create",
    command: () => {console.log("Create")}
  },
  {
    key: "R",
    message: "Read",
    command: () => {console.log("Read")},
    verify: () => true
  }, 
  {
    key: "U",
    message: "Update",
    command: () => {console.log("Update")},
  },
  {
    key: "S",
    message: "Schedule",
    command: () => {console.log("Schedule")},
    contextObject: "Empty",
    verify: () => 1 >= 2,
    verifyFailureMessage: "Can not start scheduling"
  },
  {
    key: "I",
    command: () => {console.log("Print the interface")}
  }
]

let cmdHandler = new CommandHandler()
let writeCallback = (type, message) => {console.log(message)}
let iob = new InterfaceObject(cmdHandler, writeCallback, interface_mock)

iob.registerCommands()

describe('Interface Object', () => {
  var output = ''
  it("should register commands of the interface object, so that each 'key' executes the 'command'", () => {
    output = test_stdout.inspectSync(() => {
      cmdHandler.process('I')
    })
    match = /Print the interface/.test(output)
    assert.ok(match)

    output = test_stdout.inspectSync(() => {
      cmdHandler.process('C')
    })
    match = /Create/.test(output)
    assert.ok(match)

    output = test_stdout.inspectSync(() => {
      cmdHandler.process('R')
    })

    match = /Read/.test(output)
    assert.ok(match)

    output = test_stdout.inspectSync(() => {
      cmdHandler.process('U')
    })
    match = /Update/.test(output)
    assert.ok(match)
  })

  it("should print all commands for which a message is given", () => {
    output = iob.getInterface()
    match = /^Create/.test(output)
    assert.ok(match)
    match = /Read/.test(output)
    assert.ok(match)
    match = /Update/.test(output)
    assert.ok(match)
    match = /Schedule\s\s$/.test(output)
    assert.ok(match)
  })

  it("should not load context objects with a failing 'verify' condition", () => {
    output = test_stdout.inspectSync(() => {
      cmdHandler.process('S')
    })
    match = /^Can not start scheduling/.test(output)
    assert.ok(match)
  })

  it("should return nothing when the commands are removed from the interface", () => {
    iob.removeCommands()
    
    output = test_stdout.inspectSync(() => {
      cmdHandler.process('I')
    })
    assert.ok(output == "")

    output = test_stdout.inspectSync(() => {
      cmdHandler.process('C')
    })
    assert.ok(output == "")
  })
})
