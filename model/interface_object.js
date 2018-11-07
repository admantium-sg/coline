class InterfaceObject {
  constructor (commandHandler, writeCallback) {
    this.commandHandler = commandHandler
    this.writeCallback = writeCallback
  }

  registerCommands () {
    this.commands.forEach((item) => {
      this.commandHandler.addListener(item.key, (cmd) => {
        item.command(cmd)
      })
    })
  }

  removeCommands () {
    this.commands.forEach((item) => {
      this.commandHandler.removeListener(item.key)
    })
  }

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
