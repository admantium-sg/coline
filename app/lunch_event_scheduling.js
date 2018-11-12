const ContextObject = require('./../model/index').ContextObject
const LunchEvent = require('./lunch_event').LunchEvent

class LunchEventScheduling extends ContextObject {
  constructor (lunchEvents, _currentEvent) {
    super([
      {
        key: 'index',
        question: () => {
          var printedEvents = ''
          this.lunchEvents.forEach((v, k, m) => {
            printedEvents += `Event #${k} - ${v.title}\r\n`
          })
          return `Which event do you want to schedule? (Number)\r\n${printedEvents}`
        },
        accept: /\d+/,
        return: /Back/
      },
      {
        key: 'confirmEvent',
        question: () => {
          _currentEvent = lunchEvents[this.answers.get('index')]
          return `Do you want to schedule the following event? ('Yes' / 'Back')\r\n` +
          `Name: ${_currentEvent.title}\r\n` +
          `Participants: ${_currentEvent.participants}`
        },
        accept: /Yes/,
        return: /Back/
      },
      {
        key: 'numberOfGroups',
        question: () => { return "How many groups do you want make? (Number / 'Back')" },
        accept: /\d+/,
        return: /Back/
      },
      {
        key: 'confirmaScheduling',
        question: () => {
          let groups = this.shuffleParticipants(_currentEvent.participants, this.answers.get('numberOfGroups'))
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
      this.lunchEvents[this.answers.get('index')].title,
      this.lunchEvents[this.answers.get('index')].date,
      this.lunchEvents[this.answers.get('index')].participants,
      this.scheduledGroups)
  }
}

module.exports = { LunchEventScheduling }