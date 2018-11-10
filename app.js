#!/usr/bin/node
// Prepare merge with branch 07_persisting_events
const CommandLineInterpreter = require('./model/index').CommandLineInterpreter
const MysteryLunch = require('./model/index').MysteryLunch

let cli = new CommandLineInterpreter()
cli.registerInterfaceObject(MysteryLunch)
cli.setup()
cli.start()
