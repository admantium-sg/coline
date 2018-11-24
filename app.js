#!/usr/bin/node
// Prepare merge with branch G_tests
const CommandLineInterpreter = require('./model/index').CommandLineInterpreter
const MysteryLunch = require('./app/mystery_lunch').MysteryLunch

let cli = new CommandLineInterpreter()
cli.registerInterfaceObject(MysteryLunch)
cli.setup()
cli.start()
