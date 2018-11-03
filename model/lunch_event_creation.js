const ContextObject = require('./context_object').ContextObject
const LunchEvent = require('./lunch_event').LunchEvent

class LunchEventCreation extends ContextObject {
  constructor () {
    super([
      {
        id: 1,
        question: () => { return 'What is the name of the event? (Any signs)' },
        accept: /.*/
      },
      {
        id: 2,
        question: () => { return "When is the event going to happen? (Any signs / 'Back')" },
        accept: /.*/,
        return: /Back/
      },
      {
        id: 3,
        question: () => { return "Who is partcipating? (Any signs, seperated by comma / 'Back')" },
        accept: /.*/,
        return: /Back/
      },
      {
        id: 4,
        question: () => {
          return "Do you want to create this event? ('Yes' / 'Back')" + '\r\n' +
            '-- TITLE  : ' + this.answers[0] + '\r\n' +
            '-- DATE   : ' + this.answers[1] + '\r\n' +
            '-- PEOPLE : ' + this.answers[2] + '\r\n'
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
    return new LunchEvent(this.answers[0], this.answers[1], this.answers[2])
  }
}

module.exports = { LunchEventCreation }
