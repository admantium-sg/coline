const AbstractContextObject = require('./abstract_interfaces').AbstractContextObject

class ContextObject extends AbstractContextObject {
  constructor(questions, object = { }) {
    super()
    this.questions = questions
    this.answers = []
    this.object = object
  }

  next() {
    if (this.isComplete()) return false
    return this.questions[this.answers.length]
  }
  answer(msg) {
    if (this.isComplete()) return false
    let current_question = this.questions[this.answers.length]

    if (current_question.return && current_question.return.test(msg)) {
      this.answers.pop()
    } else if (current_question.accept.test(msg)) {
      this.answers.push(msg)
      if (current_question.callback_accept != null) {
        return current_question.callback_accept(msg)
      }
    } else {
      // Do nothing
    }
  }

  isComplete() {
    return this.answers.length == this.questions.length
  }
}

module.exports = { ContextObject }
