#!/usr/bin/node
const CommandLineInterface = require('./model/index.js').CommandLineInterface
const MysteryLunch = require('./model/mystery_lunch').MysteryLunch

let cli = new CommandLineInterface()
cli.registerInterfaceObject(new MysteryLunch())
cli.setup()
cli.start()
