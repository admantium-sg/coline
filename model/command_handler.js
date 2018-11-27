const EventEmitter = require('events')

/**
 * CommandHandler is an EventEmitter. It receives commands, emits them to the registered ``InterfaceObjects`` and ``ContextObjects``.
 *
 * During application startup, it dependency injects a ``writeCallback`` and itself to ``InterfaceObjects`` so that they register their commands with the ``CommandHandler``.
 * 
 * ### Constructor  
 * Creates an instance with the following variables:
   * * ``contextObject`` **Object** - An object representing the current dialog
   * * ``interfaceObjects`` **Object** - The list of all objects that represent key => commands bindings
 */

class CommandHandler extends EventEmitter {

  /**
   * @constructor
   */
  constructor () {
    super()
    this.contextObject = null
    this.interfaceObjects = []
  }

  /**
   * Processes all commands.
   * * If a context object is set, emit ``context`` and the cmd message
   * * Else emit the cmd
   * * Else invoke ``echo`` with the cmd
   *
   * @param {String} cmd The command to be executed
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
   * Adds new interface objects and registers their commands with this CommandHandler.
   * 
   * @param {Object} InterfaceObject The object that is added
   * @param {Object} writeCallback Dependency Inject the write callback to the
   */
  registerInterfaceObject (InterfaceObject, writeCallback) {
    let iob = new InterfaceObject(this, writeCallback)
    this.interfaceObjects.push(iob)
    iob.registerCommands()
  }

  /**
   * Set a new context object.
   * 
   * @param {Object} object The new context object.
   */

  setContextObject (object) {
    this.contextObject = object
  }

  /**
   * Removes the current context object
   */
  resetContextObject () {
    this.contextObject = null
  }
}

module.exports = {CommandHandler}
