/**
 * ``InterfaceObject`` exposes key=>command bindings to the user. Commands are defined with these properties:
 * * ``key`` **String** - The keyboard key that invokes the command
 * * ``message`` **String** - The description shown to the user
 * * ``command`` **Function** Executed when the command is invoked. Examples include reading and saving data, showing objects, creating context objects for other dialogs etc
 * 
 * ###Constructor 
 * Creates a new instance that receives dependency injections.
   * @param {Object} commandHandler - The command handler to which the interface object listens 
   * @param {Object} writeCallback - The object on which ``write`` is executed to print answers
   * @param {Array} commands - The commands of this ``InterfaceObject``
 */
class InterfaceObject {
  /**
   * @constructor
   */
  constructor (commandHandler, writeCallback, commands) {
    this.commandHandler = commandHandler
    this.writeCallback = writeCallback
    this.commands = commands || []
  }

  /**
   * For each command, define a listener on the ``CommandHandler``.
   */
  registerCommands() {
    this.commands.forEach((item) => {
      //Handle contextObject declarations first
      if (!!item.contextObject) {
        this.commandHandler.addListener(item.key, (cmd) => {
          this.commandHandler.setContextObject(new item.contextObject)
          this.writeCallback('question', this.commandHandler.contextObject.next().question())
        })
      }
      //... then the command declarations
      else {
        this.commandHandler.addListener(item.key, (cmd) => {
          item.command(cmd)
        })
      }
    })
  }

  /**
   * Remove all commands from the ``CommandHandler``. 
   */
  removeCommands () {
    this.commandHandler.removeAllListeners();
  }

 /**
  * Returns a newline-separated string of all commands for which a message is defined.
  */
 getInterface() {
    let result = ''  
    this.commands.forEach((item) => {
      if(!!item.message) {
        result += item.message + '\r\n'
      }
    })
    return result
  }
}

module.exports = { InterfaceObject }
