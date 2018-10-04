#!/usr/local/bin/node

class MysteryLunch {
   constructor() {
      this.stdout = process.stdout;
      this.stdin = process.stdin;
      this.stdin.setEncoding('utf-8');

      this.prompt = "$: ";
      this.rprompt = "$> ";
      this.nl = "\r\n";
   }
   
   start() {
      this.stdout.write('Mystery Lunch Planner' + this.nl); 
      this.stdout.write(this.prompt);

      this.stdin.resume();

      this.stdin.on('data', (data) => {
         data = data.toString().trim();

         if(data !== 'exit') {
            this.stdout.write(this.rprompt + "'" + data + "'" + this.nl);
         }
         this.stdout.write(this.prompt);
      });
   }
}

//mystl = new MysteryLunch();
//mystl.start();

module.exports = MysteryLunch;