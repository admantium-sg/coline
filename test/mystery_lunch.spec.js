#!/usr/local/bin/mocha
// Prepare merge with branch A_event_emitter_redesign
var assert = require('chai').assert
var should = require('chai').should()
var expect = require('chai').expect

var test_stdout = require('test-console').stdout
var test_stdin = require('mock-stdin').stdin()
var fs = require('fs')

const CommandLineInterface = require('./../model/index.js').CommandLineInterface
const MysteryLunch = require('./../model/index.js').MysteryLunch

let cli = new CommandLineInterface()
cli.registerInterfaceObject(new MysteryLunch())
cli.setup()

describe('CommandLineInterface', () => {
  describe("Startup and echoing 'Hello'", () => {
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
  describe('Managaging events', () => {
    var output = 'foo'
    it("should start the creation of an event when I type 'manage events'", () => {
      output = test_stdout.inspectSync(() => {
        test_stdin.send('I')
      })
      match = /\$> Welcome to managing events\. What do you want to do\?/.test(output)
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
    it("should print the 'Thank You' message when I finished the object creation", () => {
      output = test_stdout.inspectSync(() => {
        test_stdin.send('Sebastian, Janine')
      })
      match = /Thank you! The event is registered\./.test(output)
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

      match = /Sebastian, Janine/.test(output)
      assert.ok(match)
    })
  })
})
