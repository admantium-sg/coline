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

  defineCommands(commands) {
    this.commands = commands.concat([{
      key: 'context',
      command: (cmd) => {
        let cob = this.commandHandler.contextObject
        cob.answer(cmd)
        // IF cob is cancelled, print out the cancel message and stop
        if (cob.isCanceled()) {
          this.writeCallback('result', cob.stop())
          this.commandHandler.resetContextObject()
          // IF cob is incomplete, print out next question
        } else if (!cob.isComplete()) {
          this.writeCallback('question', cob.next().question())
          // ELSE Add created object and reset context object
          // Check for the type of event, and process accordingly
        } else {
          cob.persist()
          this.writeCallback('result', cob.finalize())
          this.commandHandler.resetContextObject()
        }
      }
    }])
  }

  /**
   * For each command, define a listener on the ``CommandHandler``.
   */
  registerCommands() {
    this.commands.forEach((item) => {
      //Handle contextObject declarations first
      if (!!item.contextObject) {
        this.commandHandler.addListener(item.key, (cmd) => {
          if(item.hasOwnProperty('verify') && !item.verify()) {
            this.writeCallback('result', item.verifyFailureMessage)
            return
          }
          else if(!!item.contextArgs) {
            this.commandHandler.setContextObject(new item.contextObject(...item.contextArgs))
          }
          else {
            this.commandHandler.setContextObject(new item.contextObject())
          }
          this.writeCallback('question', this.commandHandler.contextObject.next().question())
        })
      //... then the command declarations
      } else {
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
