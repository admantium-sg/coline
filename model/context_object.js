class ContextObject {
  constructor(questions = [], object = { }) {
    this.questions = questions
    this.answers = []
    this.object = object
  }

  next() {
    if (this.isComplete()) 
      return false
    else 
      return this.questions[this.answers.length] 
  }

  answer(msg) {
    // Don't accept answer if the object is complete
    if (this.isComplete()) return false

    let current_question = this.questions[this.answers.length]
    // Go back one question if the answer matches the 'return' value
    if (current_question.return && current_question.return.test(msg)) {
      this.answers.pop()
    //Accept answer when it confirms with the 'accept' value  
    } else if (current_question.accept.test(msg)) {
      this.answers.push(msg)
    } else {
      // Do nothing
    }
  }

  isComplete() {
    return this.answers.length == this.questions.length
  }

  finalize () { 
    return 'Success message' 
  }
}

module.exports = { ContextObject }
