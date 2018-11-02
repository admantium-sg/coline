const ContextObject = require('./context_object').ContextObject

class LunchEventDeletion extends ContextObject {
  constructor(lunchEvents) {
    super([
      {
        id: 1,
        question: () => { 
          var printedEvents = ''
          lunchEvents.forEach((v,k,m) => { 
            printedEvents += "Event #" + k + " - " + v.title + "\r\n"
          })
          return 'Which event do you want to delete? (Number)' + "\r\n" + printedEvents
           },
        accept: /\d+/,
        validate: (index) => {
          return(!!lunchEvents[index])
        }
      },
      {
        id: 2,
        question: () => { 
          return "Do you want to delete the following event? (Yes/Back/Exit) " + "\r\n"
          + "Name: '" + lunchEvents[this.answers[0]].title + "'" + "\r\n"
          + "Participants: '" + lunchEvents[this.answers[0]].participants + "'" },
        accept: /Yes/,
        return: /Back/
      }
    ], {title: '', date: '', participants: ''})
  }
}

module.exports = { LunchEventDeletion }
