const ContextObject = require('./../model/index').ContextObject
const LunchEvent = require('./lunch_event').LunchEvent

const questions = function(self) {
  let _currentEvent

  return [
    {
      key: 'index',
      question: () => {
        var printedEvents = ''
        self.lunchEvents.forEach((v, k, m) => {
          printedEvents += 'Event #' + k + ' - ' + v.title + '\r\n'
        })
        return 'Which event do you want to update? (Number)' + '\r\n' + printedEvents
      },
      accept: /\d+/,
      return: /Back/,
      validate: (index) => {
        return (!!self.lunchEvents[index])
      }
    },
    {
      key: 'confirmEvent',
      question: () => {
        _currentEvent = self.lunchEvents[self.answers.get('index')]
        return `Do you want to update the following event? ('Yes' / 'Back')\r\n` +
               `Name: ${_currentEvent.title}\r\n` +
               `Participants: ${_currentEvent.participants}`
      },
      accept: /Yes/,
      return: /Back/
    },
    {
      key: 'title',
      question: () => { return `Event Name '${_currentEvent.title}' - new name? (Any signs)` },
      accept: /.*/,
      return: /Back/
    },
    {
      key: 'date',
      question: () => { return `Event Date '${_currentEvent.date}' - new date? (YYYY-MM-DD /'Back')` },
      accept: /\d{4}-\d{2}-\d{2}/,
      return: /Back/
    },
    {
      key: 'participants',
      question: () => { return `Event Participants '${_currentEvent.participants}' - new participants? (Any signs, seperated by comma /'Back')` },
      accept: /.*/,
      return: /Back/
    },
    {
      key: 'confirmUpdating',
      question: () => {
        return `Do you want to update the event with these values? ('Yes' / 'Back')\r\n` +
        `-- TITLE  : ${self.answers.get('title')}\r\n` +
        `-- DATE   : ${self.answers.get('date')}\r\n`+
        `-- PEOPLE : ${self.answers.get('participants')}\r\n`
      },
      accept: /Yes/,
      return: /Back/
    }
  ]
}

class LunchEventUpdating extends ContextObject {
  constructor (lunchEvents) {
    super()
    this.lunchEvents = lunchEvents
    this.questions = questions(this)
  }

  finalize () {
    return 'Thank you, the event has been added'
  }

  stop () {
    return 'Event creation cancelled'
  }

  persist () {
    this.lunchEvents.splice(this.answers.get('index'), 1, new LunchEvent(this.answers.get('title'), this.answers.get('date'), this.answers.get('participants')))
  }
}

module.exports = { LunchEventUpdating }
