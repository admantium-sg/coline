const ContextObject = require('./context_object').ContextObject
const LunchEvent = require('./lunch_event').LunchEvent

class LunchEventUpdating extends ContextObject {
  constructor (lunchEvents, _currentEvent) {
    super([
      {
        key: 'index',
        question: () => {
          var printedEvents = ''
          lunchEvents.forEach((v, k, m) => {
            printedEvents += 'Event #' + k + ' - ' + v.title + '\r\n'
          })
          return 'Which event do you want to update? (Number)' + '\r\n' + printedEvents
        },
        accept: /\d+/,
        return: /Back/,
        validate: (index) => {
          return (!!lunchEvents[index])
        }
      },
      {
        key: 'confirmaEvent',
        question: () => {
          _currentEvent = lunchEvents[this.answers.get('index')]
          console.log("CURRENT " + _currentEvent)
          return `Do you want to update the following event? ('Yes' / 'Back')\r\n` +
                 `Name: ${_currentEvent.title}\r\n` +
                 `Participants: ${_currentEvent.participants}`
        },
        accept: /Yes/,
        return: /Back/
      },
      {
        key: 'title',
        question: () => { console.log("CURRENT " + _currentEvent); return `Event Name '${_currentEvent.title}' - new name? (Any signs)` },
        accept: /.*/,
        return: /Back/
      },
      {
        key: 'date',
        question: () => { return `Event Date '${_currentEvent.date}' - new date? (Any signs /'Back')` },
        accept: /.*/,
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
          `-- TITLE  : ${this.answers.get('title')}\r\n` +
          `-- DATE   : ${this.answers.get('date')}\r\n`+
          `-- PEOPLE : ${this.answers.get('participants')}\r\n`
        },
        accept: /Yes/,
        return: /Back/
      }
    ])
  }

  finalize () {
    return 'Thank you, the event has been added'
  }

  stop () {
    return 'Event creation cancelled'
  }

  persist () {
    return new LunchEvent(this.answers.get('title'), this.answers.get('date'), this.answers.get('participants'))
  }
}

module.exports = { LunchEventUpdating }
