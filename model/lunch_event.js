const ContextObject = require('./context_object').ContextObject

const object = {title: '', date: '', participants: ''}

const questions = [
  {
    id: 1,
    question: 'What is the name of the event?',
    accept: /.*/,
    callback_accept: (title) => {object.title = title}
  },
  {
    id: 2,
    question: "When is the event going to happen? (Any sign) / 'Back'",
    accept: /.*/,
    return: /Back/,
    callback_accept: (date) => {object.date = date}
  }, 
  {
    id: 3,
    question: "Who is partcipating? (Any sign) / 'Back'",
    accept: /.*/,
    return: /Back/,
    callback_accept: (participants) => {object.participants = participants}
  }, 
  {
    id: 4,
    question: "Do you want to create this event? (Yes / No)",
    accept: /Yes/,
    return: /Back/,
    callback_accept: () => {return object}
  } 
]

class LunchEvent extends ContextObject {
    constructor() {
      super(questions, object)
    }
}

module.exports = { LunchEvent }
