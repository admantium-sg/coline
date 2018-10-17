#!/usr/local/bin/mocha
// Prepare merge with branch A_event_emitter_redesign
var assert = require('chai').assert
var should = require('chai').should()
var expect = require('chai').expect

var test_stdout = require('test-console').stdout
var test_stdin = require('mock-stdin').stdin()

const MysteryLunch = require('./../model/index.js').MysteryLunch
const LunchEvent = require('./../model/index.js').LunchEvent
const LunchEventError = require('./../model/index.js').LunchEventError

var mystl = new MysteryLunch()

describe('Class LunchEvent', () => {
  var test_event = new LunchEvent()
  it('Should have three questions', () => {
    LunchEvent.getCreationQuestions().should.have.lengthOf(3)
    test_event.nextQuestion().should.be.equal('What is the name of the event?')
  })
  it('Should be incomplete when I only answer two questions', () => {
    test_event.answerQuestion('Mystery Lunch 1')
    test_event.answerQuestion('2018-10-13')
    test_event.isComplete().should.be.false
  })
  it("Should then show the correct third question 'Who is participating?'", () => {
    test_event.nextQuestion().should.be.equal('Who is participating?')
  })
  it('Should be complete after answering three questions', () => {
    test_event.answerQuestion('Sebastian, Janine')
    test_event.isComplete().should.be.true
  })
  it('Should throw an error when I want to add a fourth answer', () => {
    // See Mocha Documentation - needs binding to be invoked correctly
    test_event.answerQuestion.bind(test_event).should.throw(LunchEventError)
  })
  it('Should print the given answers', () => {
    test_event.printData()[1].should.be.equal('2018-10-13')
  })
})
