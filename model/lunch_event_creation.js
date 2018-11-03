const ContextObject = require('./context_object').ContextObject

class LunchEventCreation extends ContextObject {
    constructor() {
      super([
        {
          id: 1,
          question: () => { return 'What is the name of the event? (Any signs)' },
          accept: /.*/
        },
        {
          id: 2,
          question: () => { return "When is the event going to happen? (Any signs) / 'Back'"},
          accept: /.*/,
          return: /Back/
        }, 
        {
          id: 3,
          question: () => { return "Who is partcipating? (Any signs, seperated by comma) / 'Back'"},
          accept: /.*/,
          return: /Back/
        }, 
        {
          id: 4,
          question: () => { 
            return "Do you want to create this event? ('Yes' / 'Back')" + '\r\n' 
            + '-- TITLE  : ' + this.answers[0] + '\r\n'
            + '-- DATE   : ' + this.answers[1] + '\r\n'
            + '-- PEOPLE : ' + this.answers[2] + '\r\n'
          },
          accept: /Yes/,
          return: /Back/
        } 
      ], {title: '', date: '', participants: ''})
    }

    finalize() {
      return "Thank you, the event has been added"
    }
  
    stop() {
      return "Event creation cancelled"
    }

    persist() {
      return {
        title: this.answers[0],
        date: this.answers[1],
        participants: this.answers[2],
        print: () => {
          return '-- TITLE  : ' + this.answers[0] + '\r\n'  
                 + '-- DATE   : ' + this.answers[1] + '\r\n'  
                 + '-- PEOPLE : ' + this.answers[2] + '\r\n'
        }
      }
    }
}

module.exports = { LunchEventCreation }
