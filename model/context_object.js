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
      // Check if a validate() function is defined, and then check the answer
      if(!!current_question.validate) {
        if(current_question.validate(msg)) {
          this.answers.push(msg)
        }
      //When no validate() function is defined, accept the answer
      } else {
        this.answers.push(msg)
      } 
    // All other cases
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

  persist() {
    return this.answers
  }
}

module.exports = { ContextObject }
