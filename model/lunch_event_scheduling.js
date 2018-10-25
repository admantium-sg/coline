const AbstractContextObject = require('./abstract_interfaces').AbstractContextObject

class LunchEventScheduling extends AbstractContextObject {
  constructor (lunchEventsMap) {
		super()
		this.type = 'LunchEventScheduling'
		this.answers = []
    this.lunchEvents = lunchEventsMap
    
    var questions = {
      [0, ',  (Yes / No)']
      , [1, 'Do you accept this offer?'], ]

    //console.log("++ In COB LunchEventScheduling ++")
    //console.log(this.lunchEvents);
    
    var questions = {
      // key: {Question, progress, backward, }
      1: [
        'Which event do you want to schedule? (Number)',
        /\d+/,
        null,
        () => { 
          var printedEvents = ''
			    this.lunchEvents.forEach((v,k,m) => {printedEvents += "Event #" + k + " - " + v.title + "\r\n"})
        }
      ]
      2: [
        "Do you want to schedule the following event? (Yes/No)",
        /Yes/,
        /No/,
        (index) => {
          this.printEvent(this.luncheEvents.get(index))
        }
      ]
      3: [
        "Do you accept these following groups? (Yes/No)",
        /Yes/,
        /No/,
        () => { }
      ]
    }
    

		this.getInterface = () => {
      
			
      return [ "Which event do you want to schedule?\r\n" + printedEvents ]
    }

    // New requirement: Dynamically computed to 
    this.nextQuestion = (cmd) => {
      if (/\d+/.match(cmd)) {
        let event =  this.lunchEvents.get(cmd), answer = ''
        if(!event) {
          answers.push(cmd)
          answer =  + "\r\n" + this.questions.get(this.answers.length)
        } else {
          answer = "Sorry, this event does not exist, please re-select.\r\n" + 
            this.getInterface()
        }
        return answer
      } else if (cmd === 'Yes') {
        answers.push(cmd)
        return this.questions.get(this.answers.length)
      } else if (cmd === 'No') {
        answers.pop()
        return this.questions.get(this.answers.length)
      }
    }

    this.isComplete = () => {
      return this.answers.length == this.questions.length
    }

    this.printEvent = (event) => {
      var result = '' +
					'--- TITLE  : ' + this.title +
					'--- DATE   : ' + this.date +
					'--- PEOPLE : ' + this.participant

      return result
    }

    this.finalize = () => {
			this.isSchedulde = true      
      return 'Thank you! The event is registered.'
    }
  }
}

module.exports = { LunchEventScheduling }
