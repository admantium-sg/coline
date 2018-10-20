const AbstractInterfaceObject = require('./abstract_interfaces').AbstractInterfaceObject
const LunchEvent = require('./lunch_event').LunchEvent
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

  addEvent(cob) {

  }

  registerCommands(commandHandler, writeCallback) {
    commandHandler.on('I', () => {
      console.log('Called (I)nterface for MysteryLunch')
      this.getInterface().forEach(item => writeCallback('result', item))
    })
    commandHandler.on('C', () => {
      // Bind new lunch event to context object
      commandHandler.setContextObject(new LunchEvent());
      // Print first message of context object
      writeCallback('question', commandHandler.contextObject.nextQuestion())
    })
    commandHandler.on('R', () => {
      for (let event of this.lunchEvents) {
        event.printData().forEach(item => writeCallback('result', '--- ' + item))
      }
    })
    commandHandler.on('context', (cmd) => {
      let cob = commandHandler.contextObject
      cob.answerQuestion(cmd)
      // IF incomplete print out next question
      // ELSE Add created object and reset context object
      if (!cob.isComplete()) {
        writeCallback('question', cob.nextQuestion())
      } else {
        console.log("Adding COB to events " + cob)
        this.lunchEvents.push(cob)
        writeCallback('result', cob.finalize())
        commandHandler.resetContextObject()
      }
    })
  }
}

module.exports = { MysteryLunch }
