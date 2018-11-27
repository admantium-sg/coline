/**
 * An Object that represents a dialog consisting of questions. Questions are defined with these values:
 * * ``key`` **String** - Represents The 'key 'in the key-value map that records the answer
 * * ``questions`` **Function** - Returns the message that is shown to the user. Contains code that is executed before the question is shown, for example to select the appropriate part of the objects.
 * * ``accept`` **RegRxp** - A pattern to which the given answer must match
 * * ``return`` **String** - A command that returns the dialog to the previous question. If its the first question, stop the dialog.
 * * ``validate`` **function** - When given, further validates the answer of the user, for example when choosing an index value from an array
 * 
 * ### Constructor 
 * Creates a new instance with the following variables:
 * * ``questions`` **Array** - Represents all questions that are shown to the user.
 * * ``answers`` **Map** - A map of questions => answers
 * * ``cancel`` **Boolean** - Flag to indicate that the context dialog is cancelled. 
 */
class ContextObject {
  /**
   * 
   * @param {Array} 
   */
  constructor () {
    this.questions = []
    this.answers = new Map()
    this.cancel = false
  }

  /**
   * Returns the current question of the dialog
   */
  next() { 
    if (this.isComplete()) { return false } else { return this.questions[this.answers.size] }
  }

  /**
   * Processes the user-input.
   * * If ``stop`` then exit the current dialog
   * * If a ``return`` value is defined and the answer matches this value, return to previous question or exit if it is the first question
   * * If the answer matches the ``accept`` value, and the optional ``validate`` function returns true, accept the answer and store (key => answer) in the answers array
   * * 
   * @param {String} answer The user input  
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
   * Checks if all answers of the dialog are answered.
   */
  isComplete () {
    return this.answers.size == this.questions.length
  }

  /**
   * Is invoked when the dialog is completed to return the a final message to the user.
   */
  finalize () {
    return 'Success message'
  }

  /**
   * Checks if the dialog is cancelled, for example when the ``Stop`` answer is invoked.
   */
  isCanceled () {
    return this.cancel
  }

  /**
   * When the ``Stop`` answer is given, return a message to the user.
   */
  stop () {
    return 'Stop message'
  }

  /**
   * Executed when the dialog is finished to persist objects that are modified or created with the given answers.
   */
  persist () {
    return this.answers
  }
}

module.exports = { ContextObject }
