#!/usr/local/bin/node
const fs = require('fs');
const EventEmitter = require('events');

class Handler extends EventEmitter {}

class LunchEvent {
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
      if (this.answers.length === 3) throw new LunchEventError('All questions are already answered');
      this.answers.push(data);
   }

   isComplete() {
      return this.answers.length === 3;
   }
}

class LunchEventError extends Error {};

class MysteryLunch {
   constructor() {
      this.events = [];

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

      this.event_creation = false;
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

      if(this.event_creation) {
         this.handler.emit('event_creation', cmd);
      }
   
      if (! this.handler.emit(cmd)) {
         this.handler.emit('default', cmd);
      };
      this.write_prompt();
   }
          
   setup_commands() {
      this.handler.on('default', (cmd) => {
         this.write_result("'" + cmd + "'");
      });
      this.handler.on('M', () => {
         this.write_result("Welcome to managing events. What do you want to do?");
         this.write_result("- (C) Create new event");
         this.write_result("- (S) Show all events");
      })
      this.handler.on('S', () => {
         this.listEvents();
      });
      this.handler.on('C', () => {

      })
      this.handler.on('exit', () => {
         this.stdin.destroy();
      });
   }

   addEvent(event = Object) {
      this.events.push(event);
   }

   listEvents() {
      for(let event of this.events) {
         this.write_result("-- " +event.title);
         this.write_result("--- " + (event.date).toISOString());
         this.write_result("--- " +event.participants);
      }   
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