var assert = require('chai').assert

var test_stdout = require('test-console').stdout
var test_stdin = require('mock-stdin').stdin()

const CommandHandler = require('./../model/index.js').CommandHandler

let ch = new CommandHandler()
ch.on("echo", () => {console.log("echo")})
ch.on("context", () => {console.log("context")})
ch.on("cmd", () => {console.log("custom command")})

describe('CommandHandler', () => {
  var output = ''

  it("should emit 'echo' per default when no context object is set", () => {
    output = test_stdout.inspectSync(() => {
      ch.process("echo")
    })
    match = /echo/.test(output)
    assert.ok(match)
  })
  it("should emit 'context' when a context object is set", () => {
    output = test_stdout.inspectSync(() => {
      ch.setContextObject({})
      ch.process("context")
    })
    match = /context/.test(output)
    assert.ok(match)
  })
  it("should emit 'custom_command' when a command listener is set and no context object", () => {
    output = test_stdout.inspectSync(() => {
      ch.resetContextObject()
      ch.process("cmd")
    })
    match = /custom command/.test(output)
    assert.ok(match)
  })
})
