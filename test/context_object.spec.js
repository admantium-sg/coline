var assert = require('chai').assert
var should = require('chai').should()

const ContextObject = require('./../model/index').ContextObject

var cob;
var questions = [
    {
      id: 1,
      question: 'Do you want to continue?',
      accept: /Yes/,
      repeat: null,
      return: /Back/,
    },
    {
      id: 2,
      question: 'Do you want to quit the program?',
      accept: /Yes/,
      repeat: /No/,
      return: /Back/,
    }, 
  ]

  var questions2 = [
    {
      id: 1,
      question: 'Lets create a lunch event!\r\nWhat is the name of the event?',
      accept: /.*/,
      repeat: null,
      return: null,
      callback_accept: (title) => {object.title = title},
    },
    {
      id: 2,
      question: "When is the event going to happen? (Any sign) / 'Back'",
      accept: /.*/,
      repeat: null,
      return: /Back/,
      callback_accept: (date) => {object.date = date},
    }, 
    {
      id: 3,
      question: "Who is partcipating? (Any sign) / 'Back'",
      accept: /.*/,
      repeat: null,
      return: /Back/,
      callback_accept: (participants) => {object.participants = participants},
    }, 
    {
      id: 4,
      question: "Do you want to create this event? (Yes / No)",
      accept: /Yes/,
      return: /Back/,
      reset: /No/,
      callback_accept: () => {return object},
      callback_reset: (args) => {answers = []}
    } 
  ]

describe("Class ContextObject", () => {
  describe("General: Handling a simple two questions dialog", () => {
    cob = new ContextObject(questions)
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

  describe("Feature 1 - Create an object / passing state between questions", () => {
    cob2 = new ContextObject(questions2, object =  {title: '', date: '', participants: '' })

    it("Show an object with three empty  properties", () => {
      cob2.object.should.have.property('title')
      cob2.object.should.have.property('date')
      cob2.object.should.have.property('participants')
      cob2.object.title.should.be.empty
    })
    it("Fill the properties by answering the questions", () => {
      cob2.answer('My First Mystery Lunch')
      cob2.answer('2018-11-01')
      cob2.answer('Sebastian, Janine')

      cob2.object.title.should.be.eq('My First Mystery Lunch')
      cob2.object.date.should.be.eq('2018-11-01')
      cob2.object.participants.should.be.eq('Sebastian, Janine')
    })
    it("Before finisihing the questions, go back and chngne the date", () => {      
      cob2.next().question.should.equal("Do you want to create this event? (Yes / No)")
      cob2.answer('Back')
      cob2.answer('Back')
      cob2.next().question.should.equal("When is the event going to happen? (Any sign) / 'Back'")
      cob2.answer('2018-11-03')
      cob2.object.date.should.be.eq('2018-11-03')
    })
    it("Finish all questions and return the object with the final callback", () => {      
      cob2.next().question.should.equal("Who is partcipating? (Any sign) / 'Back'")
      cob2.answer('Sebastian, Janine, Markus')
      cob2.next().question.should.equal("Do you want to create this event? (Yes / No)")
      var object = cob2.answer('Yes')
      object.title.should.be.equal('My First Mystery Lunch')
      object.date.should.be.equal('2018-11-03')
      object.participants.should.be.equal('Sebastian, Janine, Markus')
      cob2.next().should.be.false
    })

  })

// close test for Class ContextConcept  
})




