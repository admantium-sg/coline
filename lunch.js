class LunchEvent {
   constructor() {
        this.menuInterface = 
           ["Welcome to managing events. What do you want to do?",
           "- (C) Create new event",
           "- (S) Show all events"]
        this.creationQuestions = 
           ["-> What is the Name of the event?",
           "What is the Name of the event?",
           "When is the event going to happen?"]
        this.answers = [];
        this
     }
   
   nextQuestion() {
        if(this.answers.length === 3) return false;
        return this.creationQuestions[this.answers.length];
     }

   answerQuestion(data) {
      if (this.answers.length === 3) throw new LunchEventError('All questions are already answered');
      this.answers.push(data);
   }

   isComplete() {
      return this.answers.length === 3;
   }
}
