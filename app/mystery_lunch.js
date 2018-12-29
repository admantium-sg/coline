const InterfaceObject = require('./../model/index').InterfaceObject
const LunchEvent = require('./lunch_event').LunchEvent
const LunchEventCreation = require('./lunch_event_creation').LunchEventCreation
const LunchEventScheduling = require('./lunch_event_scheduling').LunchEventScheduling
const LunchEventDeletion = require('./lunch_event_deletion').LunchEventDeletion
const LunchEventUpdating = require('./lunch_event_updating').LunchEventUpdating

const fs = require('fs')
const config = require('./../config/config')

const commands = function(self, lunchEvents) {
  return [
    {
      key: 'C',
      message: '(C) Create new event',
      contextObject: LunchEventCreation,
      contextArgs: [lunchEvents]
    },
    {
      key: 'S',
      message: "(S) Schedule an event",
      contextObject: LunchEventScheduling,
      contextArgs: [lunchEvents],
      verify: () => lunchEvents.length != 0,
      verifyFailureMessage: "No LunchEvents are registered, please create events first!"
    },
    {
      key: 'R',
      message: '(R) Show all events',
      command: () => {
        let i = 1
        for (let event of lunchEvents) {
          self.writeCallback('result', 'Event #' + i++ + '\r\n' + event.print())
        }
      }
    },
    {
      key: 'U',
      message: '(U) Update an event',
      contextObject: LunchEventUpdating,
      contextArgs: [lunchEvents],
      verify: () => lunchEvents.length != 0,
      verifyFailureMessage: "No LunchEvents are registered, please create events first!"
    },
    {
      key: 'D',
      message: '(D) Delete an event',
      contextObject: LunchEventDeletion,
      contextArgs: [lunchEvents],
      verify: () => lunchEvents.length != 0,
      verifyFailureMessage: "No LunchEvents are registered, please create events first!"
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
    this.defineCommands(commands(this, this.lunchEvents))
  }
}

module.exports = { MysteryLunch }
