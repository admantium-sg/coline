const ContextObject = require('./../model/index').ContextObject

class LunchEventDeletion extends ContextObject {
  constructor(lunchEvents) {
    super([
      {
        key: 'index',
        question: () => { 
          var printedEvents = ''
          lunchEvents.forEach((v,k,m) => { 
            printedEvents += "Event #" + k + " - " + v.title + "\r\n"
          })
          return 'Which event do you want to delete? (Number)' + "\r\n" + printedEvents
           },
        accept: /\d+/,
        return: /Back/,
        validate: (index) => {
          return(!!lunchEvents[index])
        }
      },
      {
        key: 'confirmDeletion',
        question: () => { 
          return `Do you want to delete the following event? (Yes/Back/Exit)\r\n` +
          `Name: ${lunchEvents[this.answers.get('index')].title}\r\n` +
          `Participants: ${lunchEvents[this.answers.get('index')].participants}` },
        accept: /Yes/,
        return: /Back/
      }
    ])
  }

  stop () {
    return 'Deletion cancelled'
  }

  finalize () {
    return 'The event has been deleted!'
  }
}

module.exports = { LunchEventDeletion }
