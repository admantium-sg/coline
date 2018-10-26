#!/usr/local/bin/mocha
// Prepare merge with branch A_event_emitter_redesign
var should = require('chai').should()
var expect = require('chai').expect
const LunchEvent = require('./../model/index.js').LunchEvent

describe('LunchEvent Context Object', () => {
  var test_event = new LunchEvent()
  it('Should have four questions', () => {
    test_event.questions.should.have.lengthOf(4)
    test_event.next().question.should.be.equal('What is the name of the event?')
  })
  it('Should be incomplete when I only answer two questions', () => {
    test_event.answer('Mystery Lunch 1')
    test_event.answer('2018-10-13')
    test_event.isComplete().should.be.false
  })
  it("Should then show the correct third question 'Who is participating?'", () => {
    test_event.next().question.should.be.equal('Who is participating?')
  })
  it('Should be complete after answering four questions', () => {
    test_event.answer('Sebastian, Janine')
    test_event.answer('Yes')
    test_event.isComplete().should.be.true
  })
  it('Should print the given answers', () => {
    console.log(test_event)
    test_event.object.date.should.be.equal('2018-10-13')
  })
})
