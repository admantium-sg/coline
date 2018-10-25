class AbstractCommandLineInterpreter {
  constructor () {
    this.inputStream
    this.outputStream
    this.logStream
    this.commandHandler
  }
  setup () {}
  start () {}
  process () {}
  stop () {}
  write (type, text) {}

  registerInterfaceObject (object) {}
}

class AbstractInterfaceObject {
  getInterface () {}
  registerCommands (commandHandler, writeCallback) {}
}

class AbstractContextObject {
  constructor () {
    this.contextObject
    this.commandHandler
  }
  next () {}
  answer () {}
  finalize () { return 'Success message' }
}

class AbstractCommand {
  constructor (key, func) {
    this.key
    this.func
  }
}

module.exports = {
  AbstractCommandLineInterpreter,
  AbstractInterfaceObject,
  AbstractContextObject,
  AbstractCommand }
