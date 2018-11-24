/**
 * InterfaceObjects expose key=>command bindings to the user. Commands are defined with these properties.
 * * key: The keyboard key that invokes the command
 * * message: The description shown to the user
 * * command: A function that is executed when the command is called. Exampled include reading and saving data, showing objects, creating context objects for other dialogues
 */
class InterfaceObject {
  /**
   * Constructor that receives dependency injections
   * @param {Object} commandHandler - The command handler to which the interface object listens 
   * @param {Object} writeCallback - The object on which ``write`` is executed to print answers
   */
  constructor (commandHandler, writeCallback, commands) {
    this.commandHandler = commandHandler
    this.writeCallback = writeCallback
    this.commands = commands || []
  }

  /**
   * For each command, define a listener on the CommandHandler
   */
  registerCommands () {
    this.commands.forEach((item) => {
      this.commandHandler.addListener(item.key, (cmd) => {
        item.command(cmd)
      })
    })
  }

  /**
   * Remove all commands from the CommandHandler 
   */
  removeCommands () {
    this.commandHandler.removeAllListeners();
  }

 /**
  * Returns a newline-seperated String of all commands for which a message is defined
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
