var assert = require('chai').assert
var should = require('chai').should()

const ContextObject = require('./../model/index').ContextObject

const questions = [
  {
    key: 'title',
    question: () => { return 'What is the name of the event?' },
    accept: /.*/,
    return: /Back/
  },
  {
    key: 'date',
    question: () => { return "When is the event going to happen?" },
    accept: /\d{4}-\d{2}-\d{2}/,
    return: /Back/
  },
  {
    key: 'participants',
    question: () => { return "Who is partcipating?" },
    accept: /.*/,
    return: /Back/,
    validate: (answer) => { return answer.split(',').length >= 3 }
  },
  {
    key: 'confirm',
    question: () => {
      return `Do you want to create this event?`
    },
    accept: /Yes/,
    return: /Back/
  }
]

class TestContextObject extends ContextObject {
  constructor() {
    super()
    this.questions = questions
  }
}

describe('Class ContextObject', () => {
  var cob = new TestContextObject()

  it('should print the first question', () => {
    cob.next().question().should.equal('What is the name of the event?')
  })
  it('should print the second question when I answer the first one', () => {
    cob.answer("Test Lunch")
    cob.next().question().should.equal("When is the event going to happen?")
  })
  it("should build a 'key=>answer' map which includes the first two questions", () => {
    cob.answer("2018-11-18")
    cob.answers.has('title').should.be.true
    cob.answers.has('date').should.be.true
    cob.answers.get('title').should.equal("Test Lunch")
    cob.answers.get('date').should.equal("2018-11-18")
  })
  it("should return to the first question when I answer 'Back', and the  'key=>answer' map should be empty", () => {
    cob.answer('Back')
    cob.answer('Back')
    cob.next().question().should.equal('What is the name of the event?')
    cob.answers.size.should.equal(0)
  })
  it("should validate the third answer - a minimum of three participants, comma-separated, is required", () => {
    cob.answer("Test Lunch")
    cob.answer("2018-11-18")
    cob.answer('You, Me')
    cob.next().question().should.equal('Who is partcipating?')
    cob.answer('You')
    cob.next().question().should.equal('Who is partcipating?')
    cob.answer('You, Me, Them')
    cob.next().question().should.equal('Do you want to create this event?')
  })
  it("should be complete after answering the fourth question", () => {
    cob.answer('Yes')
    cob.isComplete().should.be.true
  })
  it("should return the complete 'key=>answer' map when calling 'persist'", () => {
    cob.persist().size.should.equal(4)
    cob.persist().get('title').should.equal("Test Lunch")
    cob.persist().get('date').should.equal("2018-11-18")
    cob.persist().get('participants').should.equal("You, Me, Them")
    cob.persist().get('confirm').should.equal("Yes")
  })
  it('should not process any further answers', () => {
    cob.answer('Yes')
    cob.answer('Yes')
    cob.next().should.be.false
  })
  // close test for Class ContextConcept
})


