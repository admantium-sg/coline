const ContextObject = require('./../model/index').ContextObject
const LunchEvent = require('./lunch_event').LunchEvent

const questions = function(self) {
  return [
    {
      key: 'title',
      question: () => { return 'What is the name of the event? (Any signs)' },
      accept: /.*/,
      return: /Back/
    },
    {
      key: 'date',
      question: () => { return "When is the event going to happen? (YYYY-MM-DD / 'Back')" },
      accept: /\d{4}-\d{2}-\d{2}/,
      return: /Back/,
      validation: () => {  }
    },
    {
      key: 'participants',
      question: () => { return "Who is participating? (Any signs, seperated by comma / 'Back')" },
      accept: /.*/,
      return: /Back/
    },
    {
      key: 'confirmCreation',
      question: () => {
        return `Do you want to create this event? ('Yes' / 'Back')\r\n` +
        `-- TITLE  : ${self.answers.get('title')}\r\n` +
        `-- DATE   : ${self.answers.get('date')}\r\n` +
        `-- PEOPLE : ${self.answers.get('participants')}\r\n`
      },
      accept: /Yes/,
      return: /Back/
    }
  ]
}

class LunchEventCreation extends ContextObject {

  constructor() {
    super()
    this.questions = questions(this)
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

