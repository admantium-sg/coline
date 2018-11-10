const InterfaceObject = require('./interface_object').InterfaceObject
const LunchEvent = require('./lunch_event').LunchEvent
const LunchEventCreation = require('./lunch_event_creation').LunchEventCreation
const LunchEventScheduling = require('./lunch_event_scheduling').LunchEventScheduling
const LunchEventDeletion = require('./lunch_event_deletion').LunchEventDeletion
const LunchEventUpdating = require('./lunch_event_updating').LunchEventUpdating

const fs = require('fs')
const config = require('./../config/config')

class MysteryLunch extends InterfaceObject {
  constructor (commandHandler, writeCallback) {
    super(commandHandler, writeCallback)

    this.lunchEvents = []

    this.commands = [
      {
        key: 'C',
        message: '(C) Create new event',
        command: () => {
          // Bind new lunch event to context object
          this.commandHandler.setContextObject(new LunchEventCreation())
          // Print first message of context object
          this.writeCallback('question', this.commandHandler.contextObject.next().question())
        }
      },
      {
        key: 'S',
        message: "(S) Schedule an event",
        command: () => {
          // Bind new lunch event to context object
          this.commandHandler.setContextObject(new LunchEventScheduling(this.lunchEvents))
          // Print first message of context object
          this.writeCallback('question', this.commandHandler.contextObject.next().question())
        }
      },
      {
        key: 'R',
        message: '(R) Show all events',
        command: () => {
          let i = 1
          for (let event of this.lunchEvents) {
            this.writeCallback('result', 'Event #' + i++ + '\r\n' + event.print())
          }
        }
      },
      {
        key: 'U',
        message: '(U) Update an event',
        command: () => {
          this.commandHandler.setContextObject(new LunchEventUpdating(this.lunchEvents))
          this.writeCallback('question', this.commandHandler.contextObject.next().question())
        }
      },
      {
        key: 'D',
        message: '(D) Delete an event',
        command: () => {
          this.commandHandler.setContextObject(new LunchEventDeletion(this.lunchEvents))
          this.writeCallback('question', this.commandHandler.contextObject.next().question())
        }
      },
      {
        key: 'context',
        command: (cmd) => {
          let cob = this.commandHandler.contextObject
          cob.answer(cmd)
          // IF cob is cancelled, print out the cancel message and stop
          if (cob.isCanceled()) {
            this.writeCallback('result', cob.stop())
            this.commandHandler.resetContextObject()
          // IF cob is incomplete, print out next question
          } else if (!cob.isComplete()) {
            this.writeCallback('question', cob.next().question())
          // ELSE Add created object and reset context object
          // Check for the type of event, and process accordingly
          } else {
            if (Object.getPrototypeOf(cob) === LunchEventCreation.prototype) {
              this.lunchEvents.push(cob.persist())
            } else if (Object.getPrototypeOf(cob) === LunchEventDeletion.prototype) {
              this.lunchEvents.splice([cob.answers.get('index')], 1)
            } else if (Object.getPrototypeOf(cob) === LunchEventUpdating.prototype) {
              this.lunchEvents.splice(cob.answers.get('index'), 1, cob.persist())
            } else if (Object.getPrototypeOf(cob) === LunchEventScheduling.prototype) {
              this.lunchEvents.splice(cob.answers.get('index'), 1, cob.persist())
            }
            this.writeCallback('result', cob.finalize())
            this.commandHandler.resetContextObject()
          }
        }
      },
      {
        key: 'I',
        message: '(I) Show Interface',
        command: () => {
          this.writeCallback('result', 'Welcome to managing lunch events. What do you want to do?' + '\r\n' + this.getInterface())
        }
      },
      {
        key: 'Save',
        message: '(Save) Save all events to a file',
        command: () => {
          fs.writeFileSync(config.storeFile, JSON.stringify(this.lunchEvents))
          this.writeCallback('result', `Saved all lunch events to '${config.storeFile}'`)
        }
      },
      {
        key: 'Load',
        message: '(Load) Load events from the default file',
        command: () => {
          let lunchEventsJSON = JSON.parse(fs.readFileSync(config.storeFile))
          lunchEventsJSON.forEach( (lunch) => {
            if(!!lunch.scheduledGroups) {
              this.lunchEvents.push(new LunchEvent(lunch.title, lunch.date, lunch.participants, lunch.scheduledGroups))  
            } else { 
              this.lunchEvents.push(new LunchEvent(lunch.title, lunch.date, lunch.participants))
            }
          })
          this.writeCallback('result', `Load all lunch events from '${config.storeFile}'`)
        }
      }
    ]
  }
}

module.exports = { MysteryLunch }
