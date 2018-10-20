const AbstractInterfaceObject = require('./abstract_interfaces').AbstractInterfaceObject

class MysteryLunch extends AbstractInterfaceObject {
  constructor() {
    super()
    this.lunchEvents = []
  }

  getInterface() {
    return ['Welcome to managing events. What do you want to do?',
      '- (C) Create new event',
      '- (R) Show all events',
      '- (U) Update an event',
      '- (D) Delete an event']
  }

  registerCommands(commandHandler, writeCallback) {
    commandHandler.on('I', () => {
      console.log('Called (I)nterface for MysteryLunch')
      this.getInterface().forEach(item => writeCallback('result', item))
    })
    commandHandler.on('C', () => {
      // Bind new lunch event to context object
      this.contextObject = new LunchEvent()
      // Print first message of context object
      writeCallback('question', this.contextObject.nextQuestion())
    })
    commandHandler.on('R', () => {
      for (let event of this.lunch_events) {
        event.printData().forEach(item => writeCallback('result', '--- ' + item))
      }
    })
    commandHandler.on('event_creation', (cmd) => {
      this.contextObject.answerQuestion(cmd)
      // IF incomplete print out next question
      // ELSE Add created object and reset context object
      if (!this.contextObject.isComplete()) {
        writeCallback('question', this.contextObject.nextQuestion())
      } else {
        this.addEvent(this.contextObject)
        writeCallback('result', this.contextObject.getSuccessMessage())
        this.contextObject = null
      }
    })
  }

    addEvent(lunch_event = Object) {
      this.lunch_events.push(lunch_event)
    }
  }

module.exports = { MysteryLunch }

