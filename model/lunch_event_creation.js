const ContextObject = require('./context_object').ContextObject
const LunchEvent = require('./lunch_event').LunchEvent

class LunchEventCreation extends ContextObject {
  constructor () {
    super([
      {
        id: 'name',
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
          let title = this.answers[0], date = this.answers[1], participants = this.answers[2]
          return `Do you want to create this event? ('Yes' / 'Back')\r\n` +
          `-- TITLE  : ${title}\r\n` +
          `-- DATE   : ${date}\r\n` +
          `-- PEOPLE : ${participants}\r\n`
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
