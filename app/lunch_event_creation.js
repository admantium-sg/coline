const ContextObject = require('./../model/index').ContextObject
const LunchEvent = require('./lunch_event').LunchEvent

class LunchEventCreation extends ContextObject {
  constructor () {
    super([
      {
        key: 'title',
        question: () => { return 'What is the name of the event? (Any signs)' },
        accept: /.*/,
        return: /Back/
      },
      {
        key: 'date',
        question: () => { return "When is the event going to happen? (Any signs / 'Back')" },
        accept: /.*/,
        return: /Back/
      },
      {
        key: 'participants',
        question: () => { return "Who is partcipating? (Any signs, seperated by comma / 'Back')" },
        accept: /.*/,
        return: /Back/
      },
      {
        key: 'confirmCreation',
        question: () => {
          return `Do you want to create this event? ('Yes' / 'Back')\r\n` +
          `-- TITLE  : ${this.answers.get('title')}\r\n` +
          `-- DATE   : ${this.answers.get('date')}\r\n` +
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

module.exports = { LunchEventCreation }
