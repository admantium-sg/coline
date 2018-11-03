#!/usr/bin/node
// Prepare merge with branch 06_crud_lunch_events
const CommandLineInterpreter = require('./model/index').CommandLineInterpreter
const MysteryLunch = require('./model/index').MysteryLunch

let cli = new CommandLineInterpreter()
cli.registerInterfaceObject(MysteryLunch)
cli.setup()
cli.start()
