#!/usr/local/bin/node
const fs = require('fs');
const EventEmitter = require('events');

class Handler extends EventEmitter {}

class LunchEvent {
   constructor() {
      this.answers = [];
   
      this.nextQuestion = () => {
         if(this.answers.length === 3) return false;
         return this.constructor.getCreationQuestions()[this.answers.length];
      }

      this.answerQuestion = (data) => {
         if (this.answers.length === 3) throw new LunchEventError('All questions are already answered');
         this.answers.push(data);
      }

      this.isComplete = () => {
         return this.answers.length === 3;
      }

      this.printData = () => {
         return [this.answers[0],
            this.answers[1],
            this.answers[2]];
      }
   }

   static getInterfaceMenu() { 
      return ["Welcome to managing events. What do you want to do?",
         "- (C) Create new event",
         "- (S) Show all events"];
   }

   static getCreationQuestions() {
      return ["What is the name of the event?",
         "When is the event going to happen?",
         "When is the event going to happen?"];
   }
}

class LunchEventError extends Error {};

class MysteryLunch {
   constructor() {
      this.lunch_events = [];

      this.stdout = process.stdout;
      this.stdin = process.stdin;
      this.stdin.setEncoding('utf-8');
      this.handler = new Handler();

      this.prompt = "$: ";
      this.rprompt = "$> ";
      this.nl = "\r\n";

      this.logfile = './mystl.log';
      fs.unlink('./mystl.log', (err) => {
         if(err) throw err;
      });
      this.setup_commands();

      this.contextObject = null;
      this.question_counter = 0;
   }
   
   start() {
      this.write_line('Mystery Lunch Planner'); 
      this.write_prompt();

      this.stdin.on('data',  (raw_data) => {
         this.stdin.pause();
         this.handle_command(raw_data)
         this.stdin.resume();
      });
   }

   handle_command(raw_data) {
      let cmd  = raw_data.toString().trim();
      this.log(cmd + this.nl);

      if(this.contextObject) {
         this.handler.emit('event_creation', cmd);
      } else if (! this.handler.emit(cmd, cmd)) {
         this.handler.emit('default', cmd);
      };
   }
          
   setup_commands() {
      this.handler.on('default', (cmd) => {
         this.write_result("'" + cmd + "'");
      });
      this.handler.on('M', () => {
         LunchEvent.getInterfaceMenu().forEach(item => this.write_result(item));
      })
      this.handler.on('S', () => {
         for(let event of this.lunch_events) {
            event.printData().foreach(item => this.write_line("--- " + item));
         }  
      });
      this.handler.on('C', () => {
         //Bind new lunch event to context object
         this.contextObject = new LunchEvent();
         //Print first message of context object
         this.write_question(this.contextObject.nextQuestion());
      })
      this.handler.on('event_creation', (cmd) => {
         // Provide 'cmd' as answer to first question
         console.log("BEFORE " + this.contextObject.nextQuestion());
         this.contextObject.answerQuestion(cmd);
         
         // IF incomplete print out next question
         // ELSE Add created object and reset context object 
         if(!this.contextObject.isComplete()) {
            this.write_question(this.contextObject.nextQuestion());
         } else {
            this.addEvent(this.contextObject);
            this.contextObject = null;
            this.write_prompt;
         }
      })
      this.handler.on('exit', () => {
         this.stdin.destroy();
      });
   }

   addEvent(lunch_event = Object) {
      this.lunch_events.push(lunch_event);
   }

   log(output) {
      fs.appendFileSync(this.logfile, output, (err) => {
         if(err) throw err;
      });
   }

   write_line(cmd) {
      let output = cmd + this.nl;
      this.stdout.write(output);
      this.log(output);
   }

   write_question(question) {
      let output = question + this.nl + this.prompt;
      this.stdout.write(output);
      this.log(output);
   }

   write_prompt() {
      let output = this.prompt;
      this.stdout.write(output);
      this.log(output);
   }

   write_result(cmd)  {
      let output = this.rprompt + cmd + this.nl
      this.stdout.write(output);
      this.log(output);
   }
}

module.exports = {MysteryLunch, LunchEvent, LunchEventError};
