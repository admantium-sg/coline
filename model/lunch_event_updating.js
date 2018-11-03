const ContextObject = require('./context_object').ContextObject
const LunchEvent = require('./lunch_event').LunchEvent

class LunchEventUpdating extends ContextObject {
  constructor (lunchEvents) {
    super([
      {
        id: 1,
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
        id: 2,
        question: () => {
          return "Do you want to update the following event? ('Yes' / 'Back') " + '\r\n' +
            "Name: '" + lunchEvents[this.answers[0]].title + "'" + '\r\n' +
            "Participants: '" + lunchEvents[this.answers[0]].participants + "'"
        },
        accept: /Yes/,
        return: /Back/
      },
      {
        id: 3,
        question: () => { return "Event Name ''" + lunchEvents[this.answers[0]].title + "' - new name? (Any signs)" },
        accept: /.*/,
        return: /Back/
      },
      {
        id: 4,
        question: () => { return "Event Date ''" + lunchEvents[this.answers[0]].date + "' - new date? (Any signs /'Back')" },
        accept: /.*/,
        return: /Back/
      },
      {
        id: 5,
        question: () => { return "Event Participants ''" + lunchEvents[this.answers[0]].participants + "' - new participants? (Any signs, seperated by comma /'Back')" },
        accept: /.*/,
        return: /Back/
      },
      {
        id: 6,
        question: () => {
          return "Do you want to update the event with these values? ('Yes' / 'Back')" + '\r\n' +
            '-- TITLE  : ' + this.answers[2] + '\r\n' +
            '-- DATE   : ' + this.answers[3] + '\r\n' +
            '-- PEOPLE : ' + this.answers[4] + '\r\n'
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
    return new LunchEvent(this.answers[2], this.answers[3], this.answers[4])
  }
}

module.exports = { LunchEventUpdating }
