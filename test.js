#!/usr/local/bin/mocha
// Prepare merge with branch A_event_emitter_redesign
var assert = require('chai').assert;
var should = require('chai').should();
var expect = require('chai').expect;
var test_stdout = require('test-console').stdout;
var test_stdin = require('mock-stdin').stdin();
var fs = require('fs');
const MysteryLunch = require('./index.js').MysteryLunch;
const LunchEvent = require('./index.js').LunchEvent;
const LunchEventError = require('./index.js').LunchEventError;
var mystl = new MysteryLunch();

describe("Class LunchEvent", () => {
   var test_event = new LunchEvent();
   it("Should have three questions", () => {
      LunchEvent.getCreationQuestions().should.have.lengthOf(3);
      test_event.nextQuestion().should.be.equal('What is the name of the event?')
   })
   it("Should be incomplete when I only answer two questions", () => {
      test_event.answerQuestion('Mystery Lunch 1');
      test_event.answerQuestion('2018-10-13');
      test_event.isComplete().should.be.false;
   })
   it("Should then show the correct third question 'Who is participating?'", () => {
      test_event.nextQuestion().should.be.equal('Who is participating?');
   })
   it("Should be complete after answering three questions", () => {
      test_event.answerQuestion('Sebastian, Janine');
      test_event.isComplete().should.be.true;
   })
   it("Should throw an error when I want to add a fourth answer", () => {
      // See Mocha Documentation - needs binding to be invoked correctly
      test_event.answerQuestion.bind(test_event).should.throw(LunchEventError);
   })
   it("Should print the given answers", () => {
      test_event.printData()[1].should.be.equal('2018-10-13');
   })
})


describe("MysteryLunch", () => {
   describe("Startup and echoing 'Hello'", () => {
      var output = "";
   
      it("should print 'Mystery Lunch Planner' when started", () => {
         output = test_stdout.inspectSync( () => {
            mystl.start();
         })
         match = /Mystery Lunch Planner/.test(output);
         assert.ok(match);
      });
      
      it("should show the prompt '$:'", () => {
         match = /\$:/.test(output);
         assert.ok(match);
      });
      it("should echo 'Hello!' when I enter 'Hello'", () => {
         output = test_stdout.inspectSync( () => {
            test_stdin.send('Hello!');
         });
         match = /\$>\ \'Hello!\'/.test(output);
         assert.ok(match);
      });  
   })
   describe("Managaging events", () => {
      var output = "foo"
      it("should start the creation of an event when I type 'manage events'", () => {
         output = test_stdout.inspectSync( () => {
            test_stdin.send('M');
         });
         match = /\$> Welcome to managing events\. What do you want to do\?/.test(output);
         assert.ok(match);
      })
      it("should show the options 'Create New Event' and 'Show all events'", () => {
         match = /Create new event/.test(output);
         assert.ok(match);

         match = /Show all events/.test(output);
         assert.ok(match);
      })
      it("should create a new event by asking me a set of questions", () => {
         output = test_stdout.inspectSync( () => {
            test_stdin.send('C');
         });
         match = /What is the name of the event\?/.test(output);
         assert.ok(match);
         
         output = test_stdout.inspectSync( () => {
            test_stdin.send('My First Mystery Lunch');
            test_stdin.send('2018-11-05');
         });
         match = /Who is participating\?/.test(output);
         assert.ok(match);
      })
      it("should print the 'Thank You' message when I finished the object creation", () => {
          output = test_stdout.inspectSync( () => {
            test_stdin.send('Sebastian, Janine');
          })
          match = /Thank you! The event is registered\./.test(output);
          assert.ok(match);
      })
      it("should have an object representing the event", () => {
         let event = mystl.lunch_events[0];
         event.title.should.be.equal('My First Mystery Lunch');
         event.date.should.be.equal('2018-11-05');
         event.participants.should.be.equal('Sebastian, Janine');

      });
   })
})
