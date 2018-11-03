#!/usr/local/bin/mocha
// Prepare merge with branch A_event_emitter_redesign
var should = require('chai').should()
var expect = require('chai').expect

const LunchEventScheduling = require('./../model/index.js').LunchEventScheduling

var lunchEvents = [
  {
    title: 'First Mystery Lunch',
    date: '2018-10-26',
    participants: 'Sebastian, Janine'
  },
  {
    title: 'Second Mystery Lunch',
    date: '2018-11-14',
    participants: 'Karl, Max, Marco, Jana, Suzi, Tom, Jenny, Peter'
  }

]

describe('LunchEventScheduling Context Object', () => {
  var scheduling = new LunchEventScheduling(lunchEvents)
  it('Should have three questions', () => {
    scheduling.questions.should.have.lengthOf(3)
    scheduling.next().question.should.be.equal('Which event do you want to schedule? (Number)')
  })
  xit('Should print the list of events after answering the first question ', () => {
    scheduling.answer(1)
  })
  xit("Should show the details of the second event when I select this'", () => {

  })
  xit('Should reshuffle the groups several times, with all groups being different', () => {

  })
  xit("Should start all over again when I enter 'Back' multiple times", () => {

  })
  xit('Finally, should schedule the events and group, returning the object', () => {

  })
})
