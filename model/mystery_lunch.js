const InterfaceObject = require('./interface_object').InterfaceObject
const LunchEvent = require('./lunch_event').LunchEvent
const LunchEventScheduling = require('./lunch_event_scheduling').LunchEventScheduling

class MysteryLunch extends InterfaceObject {
  constructor(commandHandler, writeCallback) {
    super(commandHandler, writeCallback)

    this.lunchEvents = []
    
    this.commands = [
      {
        key: "I",
        command: () => {
          this.writeCallback('result', ['Welcome to managing events. What do you want to do?',
          '- (C) Create new event',
          '- (S) Schedule an event',
          '- (R) Show all events',
          '- (U) Update an event',
          '- (D) Delete an event'].join("\r\n"))
        }
      },
      {
        key: "C",
        message: "(C) Create new event",
        command: () => {
          // Bind new lunch event to context object
          this.commandHandler.setContextObject(new LunchEvent())
          // Print first message of context object
          this.writeCallback('question', this.commandHandler.contextObject.next().question())
        }
      },
      {
        key: "S",
        message: "(S) Schedule an event'",
        command: () => {
          // Bind new lunch event to context object
          this.commandHandler.setContextObject(new LunchEventScheduling(this.lunchEvents))
          // Print first message of context object
          this.writeCallback('question', this.commandHandler.contextObject.next().question())
        }
      },
      {
        key: "R",
        message: "(R) Show all events",
        command: () => {
          let i = 1
          for (let event of this.lunchEvents) {
            this.writeCallback('result', "Event #" + i++ +"\r\n" + event.print())
          }
        }
      },
      {
        key: "U",
        message: "(U) Update an event",
        command: () => {
          this.writeCallback('result', "Not Implemented Yet")
        }
      },
      {
        key: "D",
        message: "(D) Delete an event",
        command: () => {
          this.writeCallback('result', "Not Implemented Yet")
        }
      },
      {
        key: "context",
        command: (cmd) => {
          let cob = this.commandHandler.contextObject
          cob.answer(cmd)
          // IF incomplete print out next question
          // ELSE Add created object and reset context object
          if (!cob.isComplete()) {
            this.writeCallback('question', cob.next().question())
          } else {
            this.lunchEvents.push(cob.persist())
            this.writeCallback('result', cob.finalize())
            this.commandHandler.resetContextObject()
          }
        }
      }
    ]
  }
}

module.exports = { MysteryLunch }
