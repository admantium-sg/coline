#!/usr/local/bin/node
const LunchEvent = require('./lunch_event').LunchEvent
const LunchEventError = require('./lunch_event').LunchEventError

const fs = require('fs')
const EventEmitter = require('events')

class Handler extends EventEmitter {}

class MysteryLunch {
  constructor () {
    this.lunch_events = []

    this.stdout = process.stdout
    this.stdin = process.stdin
    this.stdin.setEncoding('utf-8')
    this.handler = new Handler()

    this.prompt = '$: '
    this.rprompt = '$> '
    this.nl = '\r\n'

    this.logfile = './mystl.log'
    fs.unlink('./mystl.log', (err) => {
      if (err) throw err
    })
    this.setupCommands()

    this.contextObject = null
    this.question_counter = 0
  }

  start () {
    this.writeLine('Mystery Lunch Planner')
    this.writePrompt()

    this.stdin.on('data', (rawData) => {
      this.stdin.pause()
      this.handleCommand(rawData)
      this.stdin.resume()
    })
  }

  handleCommand (rawData) {
    let cmd = rawData.toString().trim()
    this.log(cmd + this.nl)

    // If context objectt exists, emit event creation with cmd as input
    // ELSE send cmd as Event code
    // FINALLY default to echo
    if (this.contextObject) {
      this.handler.emit('event_creation', cmd)
    } else if (!this.handler.emit(cmd, cmd)) {
      this.handler.emit('default', cmd)
    };
    this.writePrompt()
  }

  setupCommands () {
    this.handler.on('default', (cmd) => {
      this.writeResult("'" + cmd + "'")
    })
    this.handler.on('M', () => {
      LunchEvent.getInterfaceMenu().forEach(item => this.writeResult(item))
    })
    this.handler.on('S', () => {
      for (let event of this.lunch_events) {
        event.printData().forEach(item => this.writeLine('--- ' + item))
      }
    })
    this.handler.on('C', () => {
      // Bind new lunch event to context object
      this.contextObject = new LunchEvent()
      // Print first message of context object
      this.writeQuestion(this.contextObject.nextQuestion())
    })
    this.handler.on('event_creation', (cmd) => {
      this.contextObject.answerQuestion(cmd)
      // IF incomplete print out next question
      // ELSE Add created object and reset context object
      if (!this.contextObject.isComplete()) {
        this.writeQuestion(this.contextObject.nextQuestion())
      } else {
        this.addEvent(this.contextObject)
        this.writeLine(this.contextObject.getSuccessMessage())
        this.contextObject = null
      }
    })
    this.handler.on('exit', () => {
      this.stdin.destroy()
    })
  }

  addEvent (lunch_event = Object) {
    this.lunch_events.push(lunch_event)
  }

  log (output) {
    fs.appendFileSync(this.logfile, output, (err) => {
      if (err) throw err
    })
  }

  writeLine (cmd) {
    let output = cmd + this.nl
    this.stdout.write(output)
    this.log(output)
  }

  writeQuestion (question) {
    let output = this.rprompt + question + this.nl
    this.stdout.write(output)
    this.log(output)
  }

  writePrompt () {
    let output = this.prompt
    this.stdout.write(output)
    this.log(output)
  }

  writeResult (cmd) {
    let output = this.rprompt + cmd + this.nl
    this.stdout.write(output)
    this.log(output)
  }
}

module.exports = { MysteryLunch, LunchEvent, LunchEventError }
