const ContextObject = require('./../model/index').ContextObject

const questions = function(self) {
  return [
    {
      key: 'index',
      question: () => { 
        var printedEvents = ''
        self.lunchEvents.forEach((v,k,m) => { 
          printedEvents += "Event #" + k + " - " + v.title + "\r\n"
        })
        return 'Which event do you want to delete? (Number)' + "\r\n" + printedEvents
         },
      accept: /\d+/,
      return: /Back/,
      validate: (index) => {
        return(!!self.lunchEvents[index])
      }
    },
    {
      key: 'confirmDeletion',
      question: () => { 
        return `Do you want to delete the following event? (Yes/Back/Exit)\r\n` +
        `Name: ${self.lunchEvents[self.answers.get('index')].title}\r\n` +
        `Participants: ${self.lunchEvents[self.answers.get('index')].participants}` },
      accept: /Yes/,
      return: /Back/
    }
  ]
}

class LunchEventDeletion extends ContextObject {
  constructor(lunchEvents) {
    super()
    this.lunchEvents = lunchEvents
    this.questions = questions(this)
  }

  stop () {
    return 'Deletion cancelled'
  }

  finalize () {
    return 'The event has been deleted!'
  }
}

module.exports = { LunchEventDeletion }
