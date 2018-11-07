class ContextObject {
  constructor (questions = []) {
    this.questions = questions
    this.answers = new Map()
    this.cancel = false
  }

  next() { 
    if (this.isComplete()) { return false } else { return this.questions[this.answers.size] }
  }

  answer (msg) {
    // Don't accept answer when all questions are answered
    if (this.isComplete()) return false

    let currentQuestion = this.questions[this.answers.size]
    // Go back one question if the answer matches the 'return' value
    if (msg === 'Stop') {
      this.cancel = true
    } else if (currentQuestion.return && currentQuestion.return.test(msg)) {
      // When returning from the first question, stop the interactions alltogether
      if (this.answers.size === 0) {
        this.cancel = true
      } else {
        this.answers.delete(this.questions[this.answers.size-1].key)
      }
    // Accept answer when it confirms with the 'accept' value
    } else if (currentQuestion.accept.test(msg)) {
      // Check if a validate() function is defined, and then check the answer
      if (currentQuestion.validate) {
        if (currentQuestion.validate(msg)) {
          this.answers.set(currentQuestion.key, msg)
        }
      // When no validate() function is defined, accept the answer
      } else {
        this.answers.set(currentQuestion.key, msg)
      }
    // All other cases
    } else {
      // Do nothing
    }
  }

  isComplete () {
    return this.answers.size == this.questions.length
  }

  finalize () {
    return 'Success message'
  }

  isCanceled () {
    return this.cancel
  }

  stop () {
    return 'Stop message'
  }

  persist () {
    return this.answers
  }
}

module.exports = { ContextObject }
