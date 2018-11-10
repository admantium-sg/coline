const EventEmitter = require('events')

/**
 * CommandHandler is an EventEmitter. It receives commands, emits them to the registered Interface Onjects and Context Objects.
 *
 * During application statrtup, it dependency injects a writeCallback and itself to InterfaceObjects so that they registr their commands with the CommandHandler.
 */

class CommandHandler extends EventEmitter {

  /**
   *  Create a new instance with the following objects:
   * * contextObject: An object representing the current dialof
   * * interfaceObjects: The list of all objects that represent key => commands bindings
   *
   * @constructor
   */
  constructor () {
    super()
    this.contextObject = null
    this.interfaceObjects = []
    this.setContextObject = (object) => {
      this.contextObject = object
    }
    this.resetContextObject = () => {
      this.contextObject = null
    }
  }

  /**
   * Processes all commands.
   * * If a context obejct is set, emit ``context`` and the cmd message
   * * Else emit the cmd
   * * Else invoke ``echo`` with the cmd
   *
   * @param {*} cmd The command to be executed
   *
   */

  process (cmd) {
    // Emit cmd, if not handled then echo
    if (this.contextObject !== null) {
      this.emit('context', cmd)
    } else if (!this.emit(cmd, cmd)) {
      this.emit('echo', cmd)
    }
  }

  /**
   * Adds new interface objects and registers their commands with this CommandHandler
   * @param {*} InterfaceObject The object that is added
   * @param {*} writeCallback Dependency Inject the write callback to the
   */
  registerInterfaceObject (InterfaceObject, writeCallback) {
    let iob = new InterfaceObject(this, writeCallback)
    this.interfaceObjects.push(iob)
    iob.registerCommands()
  }
}

module.exports = {CommandHandler}
