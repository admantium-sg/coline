/**
 * An Object that represents a dialogue consisting of questions. Questions are defined with these values:
 * * {key} Identifier ans key in the key-value map that records the answer
 * * {questions} A function that returns a message to be shown to the user. Contains code that is executed before the question is shown, for example to select the appropriate part of the obejcts.
 * * {accept} A regular exptession to which the given answer must match
 * * {return} A command that returns the dialogue to the previous question. If its the first question, stop the dialogue.
 * * {validate} A function that is involved to further validate the answer, for example when choosing an index value from an array
 */
class ContextObject {
  /**
   * 
   * @param {Array} questions Represents all questions that are shown to the user.
   */
  constructor (questions = []) {
    this.questions = questions
    this.answers = new Map()
    this.cancel = false
  }

  /**
   * Returns the current question of the dialogue
   */
  next() { 
    if (this.isComplete()) { return false } else { return this.questions[this.answers.size] }
  }

  /**
   * Processes the user-input.
   * * If `stop`` then exit the current dialogue
   * * If a ``return`` value is defined and the answer matches this value, return to previous question or exit if it is the first question
   * * If the answer matches the ``accept`` value, and the optional ``validate`` funciton returns true, accept the answer and store (key => answer) in the answers array
   * * 
   * @param {String} answer The user-input  
   */

  answer (answer) {
    // Don't accept answer when all questions are answered
    if (this.isComplete()) return false

    let currentQuestion = this.questions[this.answers.size]
    // Go back one question if the answer matches the 'return' value
    if (answer === 'Stop') {
      this.cancel = true
    } else if (currentQuestion.return && currentQuestion.return.test(answer)) {
      // When returning from the first question, stop the interactions alltogether
      if (this.answers.size === 0) {
        this.cancel = true
      } else {
        this.answers.delete(this.questions[this.answers.size-1].key)
      }
    // Accept answer when it confirms with the 'accept' value
    } else if (currentQuestion.accept.test(answer)) {
      // Check if a validate() function is defined, and then check the answer
      if (currentQuestion.validate) {
        if (currentQuestion.validate(answer)) {
          this.answers.set(currentQuestion.key, answer)
        }
      // When no validate() function is defined, accept the answer
      } else {
        this.answers.set(currentQuestion.key, answer)
      }
    // All other cases
    } else {
      // Do nothing
    }
  }

  /**
   * Checks if all answers of the questionnaire have been answered.
   */
  isComplete () {
    return this.answers.size == this.questions.length
  }

  /**
   * Is invoked when the dialogue is completed to return the a final message to the user
   */
  finalize () {
    return 'Success message'
  }

  /**
   * Checks if the dialogue is cancelled, for example when the ``Stop`` answer is invoked
   */
  isCanceled () {
    return this.cancel
  }

  /**
   * When the ``Stop`` anwer is given, retunr a message to the user
   */
  stop () {
    return 'Stop message'
  }

  /**
   * Executed when the dialogue is finsished to persist objects that are modified or created with the given answers.
   */
  persist () {
    return this.answers
  }
}

module.exports = { ContextObject }
