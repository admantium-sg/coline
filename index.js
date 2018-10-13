#!/usr/local/bin/node
const fs = require('fs');
const EventEmitter = require('events');

class Handler extends EventEmitter {}

class MysteryLunch {
   constructor() {
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

      this.stdin.on('readable',  () => {
         this.stdin.pause();
         let cmd = this.stdin.read().toString().trim();
         let response = this.handler.emit(cmd);    
         if (typeof(response) !== 'undefined') {
            this.handler.emit('default', cmd);
         };
         this.stdin.resume();
      });
   }

   setup_commands() {
      this.handler.on('default', (data) => {
         this.write_result("'" + data + "'");
         this.write_prompt();
      });
      this.handler.on('exit', () => {
         this.stdin.destroy();
      });
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



module.exports = MysteryLunch;