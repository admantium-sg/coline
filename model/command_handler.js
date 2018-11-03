const EventEmitter = require('events')

class CommandHandler extends EventEmitter {
  constructor () {
    super()
    this.contextObject = null
    this.interfaceObjects = []
    this.setContextObject = (object) => { this.contextObject = object }
    this.resetContextObject = () => { this.contextObject = null }
  }

  process (cmd) {
    // emit cmd, if not handled then echo
    if (this.contextObject !== null) {
      this.emit('context', cmd)
    } else if (!this.emit(cmd, cmd)) {
      this.emit('echo', cmd)
    }
  }

  registerInterfaceObject (InterfaceObject, writeCallback) {
    let iob = new InterfaceObject(this, writeCallback)
    this.interfaceObjects.push(iob)
    iob.registerCommands()
  }
}

module.exports = { CommandHandler }
