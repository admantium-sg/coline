const ContextObject = require('./context_object').ContextObject

class LunchEvent extends ContextObject {
    constructor() {
      super([
        {
          id: 1,
          question: () => { return 'What is the name of the event?' },
          accept: /.*/
        },
        {
          id: 2,
          question: () => { return "When is the event going to happen? (Any sign) / 'Back'"},
          accept: /.*/,
          return: /Back/
        }, 
        {
          id: 3,
          question: () => { return "Who is partcipating? (Any sign) / 'Back'"},
          accept: /.*/,
          return: /Back/
        }, 
        {
          id: 4,
          question: () => { 
            return "Do you want to create this event? (Yes / No)" + '\r\n' 
            + '-- TITLE  : ' + this.answers[0] + '\r\n'
            + '-- DATE   : ' + this.answers[1] + '\r\n'
            + '-- PEOPLE : ' + this.answers[2] + '\r\n'
          },
          accept: /Yes/,
          return: /Back/
        } 
      ], {title: '', date: '', participants: ''})
    }
}
