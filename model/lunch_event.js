#!/usr/local/bin/node
class LunchEvent {
  constructor () {
    this.answers = []
    this.title = ''
    this.date = ''
    this.participants = ''

    this.nextQuestion = () => {
      if (this.answers.length === 3) return false
      return this.constructor.getCreationQuestions()[this.answers.length]
    }

    this.answerQuestion = (data) => {
      if (this.answers.length === 3) throw new LunchEventError('All questions are already answered')
      this.answers.push(data)
    }

    this.isComplete = () => {
      return this.answers.length === 3
    }

    this.printData = () => {
      return [this.answers[0],
        this.answers[1],
        this.answers[2]]
    }

    this.getSuccessMessage = () => {
      [this.title, this.date, this.participants] = this.answers
      return 'Thank you! The event is registered.'
    }
  }

  static getInterfaceMenu () {
    return ['Welcome to managing events. What do you want to do?',
      '- (C) Create new event',
      '- (S) Show all events']
  }

  static getCreationQuestions () {
    return ['What is the name of the event?',
      'When is the event going to happen?',
      'Who is participating?']
  }
}

class LunchEventError extends Error {}

module.exports = { LunchEvent, LunchEventError }