const ContextObject = require('./context_object').ContextObject
const LunchEvent = require('./lunch_event').LunchEvent

class LunchEventScheduling extends ContextObject {
  constructor (lunchEvents) {
    super([
      {
        id: 1,
        question: () => {
          var printedEvents = ''
          this.lunchEvents.forEach((v, k, m) => {
            printedEvents += 'Event #' + k + ' - ' + v.title + '\r\n'
          })
          return 'Which event do you want to schedule? (Number)' + '\r\n' + printedEvents
        },
        accept: /\d+/
      },
      {
        id: 2,
        question: () => {
          return "Do you want to schedule the following event? ('Yes' / 'Back') " + '\r\n' +
          "Name: '" + this.lunchEvents[this.answers[0]].title + "'" + '\r\n' +
          "Participants: '" + this.lunchEvents[this.answers[0]].participants + "'"
        },
        accept: /Yes/,
        return: /Back/
      },
      {
        id: 3,
        question: () => { return "How many groups do you want make? (Number / 'Back')" },
        accept: /\d+/,
        return: /Back/
      },
      {
        id: 4,
        question: () => {
          let groups = this.shuffleParticipants(this.lunchEvents[this.answers[0]].participants, this.answers[2])
          let printedGroups = ''; let i = 1

          for (let item of groups.values()) {
            printedGroups += i++ + '. ' + item.join(', ') + '\r\n'
          }

          this.scheduledGroups = groups

          return "Do you accept the following groups? ('Yes' / 'No' to repeat / 'Back')" + '\r\n' +
            printedGroups
        },
        accept: /Yes/,
        repeat: /No/,
        return: /Back/
      }
    ])

    this.lunchEvents = lunchEvents
  }

  shuffleParticipants (participantsOrig, numberOfGroups) {
    var participants = participantsOrig.split(', ')
    var shuffledParticipants = []

    // Courtesy https://gist.github.com/guilhermepontes/17ae0cc71fa2b13ea8c20c94c5c35dc4#gistcomment-2271465
    shuffledParticipants = participants.map((a) => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map((a) => a[1])

    var factor = shuffledParticipants.length / numberOfGroups
    var result = []
    for (let a = 0; a < shuffledParticipants.length; a += factor) {
      result.push(shuffledParticipants.slice(a, a + factor))
    }
    return result
  }

  finalize () {
    return 'Thank you, the event has been scheduled'
  }

  stop () {
    return 'Event scheduling cancelled'
  }

  persist () {
    return new LunchEvent(
      this.lunchEvents[this.answers[0]].title,
      this.lunchEvents[this.answers[0]].date,
      this.lunchEvents[this.answers[0]].participants,
      this.scheduledGroups)
  }
}

module.exports = { LunchEventScheduling }
