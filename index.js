#!/usr/local/bin/node
// Prepare merge with branch '04_manage_events'
const fs = require('fs');

class MysteryLunch {
   constructor() {
      this.stdout = process.stdout;
      this.stdin = process.stdin;
      this.stdin.setEncoding('utf-8');

      this.prompt = "$: ";
      this.rprompt = "$> ";
      this.nl = "\r\n";

      this.logfile = './mystl.log';
      fs.unlink('./mystl.log', (err) => {
         if(err) throw err;
      });
   }
   
   start() {
      this.write_line('Mystery Lunch Planner'); 
      this.write_prompt();

      this.stdin.resume();

      this.stdin.on('data', (data) => {
         data = data.toString().trim();

         if(data !== 'exit') {
            this.write_line(data);
            this.write_result("'" + data + "'");
            this.write_prompt();
         }
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
