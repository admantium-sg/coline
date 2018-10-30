class LunchEventScheduling extends ContextObject {
  constructor(lunchEvents) {
    super([
      {
        id: 1,
        question: () => { 
          var printedEvents = ''
          this.lunchEvents.forEach((v,k,m) => { 
            printedEvents += "Event #" + k + " - " + v.title + "\r\n"
          })
          return 'Which event do you want to schedule? (Number)' + "\r\n" + printedEvents
           },
        accept: /\d+/
      },
      {
        id: 2,
        question: () => { 
          return "Do you want to schedule the following event? (Yes/Back)"
          + this.lunchEvents[this.answers[0]] },
        accept: /Yes/,
        return: /Back/
      },
      {
        id: 3,
        question: () => { 
          this.shuffleParticipants(this.lunchEvents[0].participants, 4)
          return "Do you accept the following groups? (Yes / No to repeat / Back)" },
        accept: /Yes/,
        repeat: /No/,
        return: /Back/,
      }
    ], {title: '', date: '', participants: ''})
    
    
    this.lunchEvents = lunchEvents
  }

  shuffleParticipants(participants, groupSize) {
    // Dummy functions
    return participants
  }

}

module.exports = { LunchEvent }
