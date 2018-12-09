#!/usr/bin/node
// Prepare merge with branch 'H_declarative_interface_objects'
const CommandLineInterpreter = require('./model/index').CommandLineInterpreter
const MysteryLunch = require('./app/mystery_lunch').MysteryLunch

let cli = new CommandLineInterpreter()
cli.registerInterfaceObject(MysteryLunch)
cli.setup()
cli.start()
