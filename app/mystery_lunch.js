const InterfaceObject = require('./../model/index').InterfaceObject
const LunchEvent = require('./lunch_event').LunchEvent
const LunchEventCreation = require('./lunch_event_creation').LunchEventCreation
const LunchEventScheduling = require('./lunch_event_scheduling').LunchEventScheduling
const LunchEventDeletion = require('./lunch_event_deletion').LunchEventDeletion
const LunchEventUpdating = require('./lunch_event_updating').LunchEventUpdating

const fs = require('fs')
const config = require('./../config/config')

const commands = function(self) {
  return [
    {
      key: 'C',
      message: '(C) Create new event',
      contextObject:  () => new LunchEventCreation()
    },
    {
      key: 'S',
      message: "(S) Schedule an event",
      command: () => {
        // Bind new lunch event to context object
        self.commandHandler.setContextObject(new LunchEventScheduling(self.lunchEvents))
        // Print first message of context object
        self.writeCallback('question', self.commandHandler.contextObject.next().question())
      }
    },
    {
      key: 'R',
      message: '(R) Show all events',
      command: () => {
        let i = 1
        for (let event of self.lunchEvents) {
          self.writeCallback('result', 'Event #' + i++ + '\r\n' + event.print())
        }
      }
    },
    {
      key: 'U',
      message: '(U) Update an event',
      command: () => {
        self.commandHandler.setContextObject(new LunchEventUpdating(self.lunchEvents))
        self.writeCallback('question', self.commandHandler.contextObject.next().question())
      }
    },
    {
      key: 'D',
      message: '(D) Delete an event',
      command: () => {
        self.commandHandler.setContextObject(new LunchEventDeletion(self.lunchEvents))
        self.writeCallback('question', self.commandHandler.contextObject.next().question())
      }
    },
    {
      key: 'context',
      command: (cmd) => {
        let cob = self.commandHandler.contextObject
        cob.answer(cmd)
        // IF cob is cancelled, print out the cancel message and stop
        if (cob.isCanceled()) {
          self.writeCallback('result', cob.stop())
          self.commandHandler.resetContextObject()
        // IF cob is incomplete, print out next question
        } else if (!cob.isComplete()) {
          self.writeCallback('question', cob.next().question())
        // ELSE Add created object and reset context object
        // Check for the type of event, and process accordingly
        } else {
          if (Object.getPrototypeOf(cob) === LunchEventCreation.prototype) {
            self.lunchEvents.push(cob.persist())
          } else if (Object.getPrototypeOf(cob) === LunchEventDeletion.prototype) {
            self.lunchEvents.splice([cob.answers.get('index')], 1)
          } else if (Object.getPrototypeOf(cob) === LunchEventUpdating.prototype) {
            self.lunchEvents.splice(cob.answers.get('index'), 1, cob.persist())
          } else if (Object.getPrototypeOf(cob) === LunchEventScheduling.prototype) {
            self.lunchEvents.splice(cob.answers.get('index'), 1, cob.persist())
          }
          self.writeCallback('result', cob.finalize())
          self.commandHandler.resetContextObject()
        }
      }
    },
    {
      key: 'I',
      message: '(I) Show Interface',
      command: () => {
        self.writeCallback('result', 'Welcome to managing lunch events. What do you want to do?' + '\r\n' + self.getInterface())
      }
    },
    {
      key: 'Save',
      message: '(Save) Save all events to a file',
      command: () => {
        fs.writeFileSync(config.storeFile, JSON.stringify(self.lunchEvents))
        self.writeCallback('result', `Saved all lunch events to '${config.storeFile}'`)
      }
    },
    {
      key: 'Load',
      message: '(Load) Load events from the default file',
      command: () => {
        let lunchEventsJSON = JSON.parse(fs.readFileSync(config.storeFile))
        lunchEventsJSON.forEach( (lunch) => {
          if(!!lunch.scheduledGroups) {
            self.lunchEvents.push(new LunchEvent(lunch.title, lunch.date, lunch.participants, lunch.scheduledGroups))  
          } else { 
            self.lunchEvents.push(new LunchEvent(lunch.title, lunch.date, lunch.participants))
          }
        })
        self.writeCallback('result', `Load all lunch events from '${config.storeFile}'`)
      }
    }
  ]
}

class MysteryLunch extends InterfaceObject {
  constructor (commandHandler, writeCallback) {
    super(commandHandler, writeCallback)
    this.lunchEvents = []
    this.commands = commands(this)
  }
}

module.exports = { MysteryLunch }
