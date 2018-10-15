class Event {
   constructor() {
        this.questions = 
           ["-> What is the Name of the event?",
           "What is the Name of the event?",
           "When is the event going to happen?"]
        this.answers = [];
     }
   
   nextQuestion() {
        if(this.answers.length === 3) return false;
        return this.questions[this.answers.length];
     }

   answerQuestion(data) {
      if (this.answers.length === 3) throw Error;
      this.answers.put(data);
   }

   isComplete() {
      return this.answers.length === 3;
   }
}
e = new Event();
e.nextQuestion
e.nextQuestion()
arr = ¢[
arr = []
arr.push
arr.push 1
arr.push 1
arr.push(1)
.sava
