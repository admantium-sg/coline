const InterfaceObject = require('./interface_object').InterfaceObject
const LunchEvent = require('./lunch_event').LunchEvent
const LunchEventCreation = require('./lunch_event_creation').LunchEventCreation
const LunchEventScheduling = require('./lunch_event_scheduling').LunchEventScheduling
const LunchEventDeletion = require('./lunch_event_deletion').LunchEventDeletion
const LunchEventUpdating = require('./lunch_event_updating').LunchEventUpdating

class MysteryLunch extends InterfaceObject {
  constructor(commandHandler, writeCallback) {
    super(commandHandler, writeCallback)

    this.lunchEvents = [ 
      new LunchEvent(
        "Test Lunch 1",
        "2018-11-03",
        "Sebastian, Janine, Max, Lea",
      ),
      new LunchEvent(
        "Test Lunch 2",
        "2018-11-07",
        "Caro, Julia, Lea, Thomas"
      )
    ]
    
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
          this.commandHandler.setContextObject(new LunchEventCreation())
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
          this.commandHandler.setContextObject(new LunchEventUpdating(this.lunchEvents))
          this.writeCallback('question', this.commandHandler.contextObject.next().question())
        }
      },
      {
        key: "D",
        message: "(D) Delete an event",
        command: () => {
          this.commandHandler.setContextObject(new LunchEventDeletion(this.lunchEvents))
          this.writeCallback('question', this.commandHandler.contextObject.next().question())
        }
      },
      {
        key: "context",
        command: (cmd) => {
          let cob = this.commandHandler.contextObject
          cob.answer(cmd)
          // IF cob is cancelled, print out the cancel message and stop
          if(cob.isCanceled()) {
            this.writeCallback('result', cob.stop())
            this.commandHandler.resetContextObject()
          }
          // IF cob is incomplete, print out next question
          else if (!cob.isComplete()) {
            this.writeCallback('question', cob.next().question())
          // ELSE Add created object and reset context object
          // Check for the type of event, and process accordingly
          } else {
            if(cob.__proto__ === LunchEventCreation.prototype) {
              this.lunchEvents.push(cob.persist())
            } else if (cob.__proto__ === LunchEventDeletion.prototype) {
              this.lunchEvents.splice([cob.answers[0]],1)
            } else if (cob.__proto__ === LunchEventUpdating.prototype) {
              this.lunchEvents.splice(cob.answers[0],1, cob.persist())
            } else if (cob.__proto__ === LunchEventScheduling.prototype) {
              this.lunchEvents.splice(cob.answers[0],1, cob.persist())
            }
            this.writeCallback('result', cob.finalize())
            this.commandHandler.resetContextObject()
          }
        }
      }
    ]
  }
}

module.exports = { MysteryLunch }
