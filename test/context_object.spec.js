var assert = require('chai').assert
var should = require('chai').should()

const AbstractContextObject = require('./../model/abstract_interfaces').AbstractContextObject

class ContextObject extends AbstractContextObject {
  constructor(questions) {
    super()
    this.questions = questions
    this.answers = []
  }

  next() {
    if (this.isComplete()) return false
    return questions[this.answers.length]
  }
  answer(msg) {
    if (this.isComplete()) return false

    let current_question = this.questions[this.answers.length]
    if(current_question.accept.test(msg)) {
      this.answers.push(msg)
    } else if(current_question.return && current_question.return.test(msg)) {
      this.answers.pop()
    } else {
      // Do nothing
    }
  }

  finalize() {

  }

  isComplete() {
    return this.answers.length == this.questions.length
  }
}

var cob;
var questions = [
    {
      id: 1,
      question: 'Do you want to continue?',
      accept: /Yes/,
      repeat: null,
      return: /Back/,
      callback_ac: () => {null},
      callback_rt: () => {null}
    },
    {
      id: 2,
      question: 'Do you want to quit the program?',
      accept: /Yes/,
      repeat: /No/,
      return: /Back/,
      callback:  () => {
        return "Callback Called"
      }
    }, 
  ]

describe("Class ContextObject", () => {
  it("should accept a map of questions with id, text, accept, repeat, return,  callback_ac, callback_rt", () => {
    cob = new ContextObject(questions)
  })
  describe("Simple two questions dialog", () => {
    it("Function next: Starting with the first question", () => {
      var q1 = cob.next()
      q1.question.should.equal("Do you want to continue?")
    })
    
    it("Function accept: Progressing to the second question when answering 'Yes'", () => {
      cob.answer('Yes')
      var q2 = cob.next()
      q2.question.should.be.equal('Do you want to quit the program?')
    })
    it("Function repeat: Staying at the second answer when answering 'no'", () => {
      cob.answer('No')
      var q2 = cob.next()
      q2.question.should.be.equal('Do you want to quit the program?')
    })
    it("Function return: Returning to the first questions when answering 'Back'", () => {
      cob.answer('Back')
      cob.next().question.should.equal("Do you want to continue?")
    })
    it("Function isComplete: When two questions are answered, it should be true", () => {
      cob.isComplete().should.be.false;
      cob.answer('Yes')
      cob.answer('Yes')
      cob.isComplete().should.be.true;
      cob.answer('Yes')
      cob.isComplete().should.be.true;
    })
    it("Error case: Try to return from first question", () => {
      cob = new ContextObject(questions)
      cob.answer('Back')
      cob.next().question.should.equal("Do you want to continue?")
    })
    it("Error case: Try to answer a third time", () => {
      cob.answer('Yes')
      cob.answer('Yes')
      cob.next().should.be.false
    })
  })
})
