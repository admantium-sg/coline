#!/usr/bin/node
const CommandLineInterpreter = require('./model/index').CommandLineInterpreter
const MysteryLunch = require('./model/index').MysteryLunch

let cli = new CommandLineInterpreter()
cli.registerInterfaceObject(new MysteryLunch())
cli.setup()
cli.start()
