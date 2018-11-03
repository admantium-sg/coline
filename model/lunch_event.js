class LunchEvent {
  constructor(title, date, participants) {
      this.title = title
      this.date = date
      this.participants = participants
  }
  
  print() {
    return '-- TITLE  : ' + this.title + '\r\n'  
           + '-- DATE   : ' + this.date + '\r\n'  
           + '-- PEOPLE : ' + this.participants
  }
  
}

module.exports = { LunchEvent }
