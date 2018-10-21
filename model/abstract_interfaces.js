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

  getInterface () {}
  nextQuestion () {}
  answerQuestion () {}
  finalize () { return 'Success message' }
  isComplete () {}

  registerCommands (type, text) {}
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
