class LunchEvent {
  constructor (title, date, participants, scheduledGroups) {
    this.title = title
    this.date = date
    this.participants = participants
    this.scheduledGroups = scheduledGroups
  }

  print () {
    let title = this.title, date = this.date, participants = this.participants
    let output = `-- TITLE  : ${title}\r\n` +
                 `-- DATE   : ${date}\r\n` +
                 `-- PEOPLE : ${participants}`

    if (this.scheduledGroups) {
      let printedGroups = '', i = 1

      for (let item of this.scheduledGroups.values()) {
        printedGroups += `---  ${i++}. ${item.join(',')}\r\n`
      }

      output += `\r\n-- GROUPS :\r\n${printedGroups}`
    }

    return output
  }
}

module.exports = { LunchEvent }
