#!/usr/local/bin/node
const fs = require('fs');
const EventEmitter = require('events');

class Handler extends EventEmitter {}

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
   
      if (! this.handler.emit(cmd)) {
         this.handler.emit('default', cmd);
      };
      this.write_prompt();
   }
          
   setup_commands() {
      this.handler.on('test', (data) => {
         this.write_result("'" + data + "'");
         
      });
      this.handler.on('default', (data) => {
         this.write_result("'" + data + "'");
      });
      this.handler.on('M', (data) => {
         this.write_result("Welcome to managing events. What do you want to do?");
         this.write_result("- (C) Create new event");
         this.write_result("- (S) Show all events");
      })
      this.handler.on('S', (data) => {
         this.listEvents();
      });
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

module.exports = {MysteryLunch};