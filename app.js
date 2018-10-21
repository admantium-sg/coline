#!/usr/bin/node
// Prepare merge with branch 'C_refactor_domain_objects'
const MysteryLunch = require('./src/index.js').MysteryLunch
const mysteryLunch = new MysteryLunch()

mysteryLunch.start()
