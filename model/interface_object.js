class InterfaceObject {
  constructor (commandHandler, writeCallback) {
    this.commandHandler = commandHandler
    this.writeCallback = writeCallback
  }

  registerCommands () {
    this.commands.forEach((item, index, value) => {
      this.commandHandler.addListener(item.key, (cmd) => {
        item.command(cmd)
      })
    })
  }

  removeCommands () {
    this.commands.forEach((item, index, value) => {
      this.commandHandler.removeListener(item.key)
    })
  }
}

module.exports = { InterfaceObject }
