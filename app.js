#!/usr/bin/node
// Prepare merge with branch E_generic_interface_objects
const CommandLineInterpreter = require('./model/index').CommandLineInterpreter
const MysteryLunch = require('./model/index').MysteryLunch

let cli = new CommandLineInterpreter()
cli.registerInterfaceObject(new MysteryLunch())
cli.setup()
cli.start()
