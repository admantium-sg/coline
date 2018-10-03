#!/usr/local/bin/node

class MysteryLunch {
   constructor() {
      this.stdout = process.stdout;
      this.prompt = "$: ";
   }
   
   start() {
      this.stdout.write('Mystery Lunch Planner');   
   }
   session() {
      this.stdout.write(this.prompt);
   }
}

module.exports = MysteryLunch;