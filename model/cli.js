const fs = require('fs')
const CommandHandler = require('./command_handler').CommandHandler
const config = require('./../config/config')

class CommandLineInterpreter {
  // Provides bindings for all variables from the abstract class
  constructor () {
    this.inputStream = config.inputStream
    this.outputStream = config.outputStream
    this.logStream = {
      write: (text) => {
        fs.appendFileSync(config.logFile, text, (err) => {
          if (err) throw err
        })
      }
    }
    this.commandHandler = new CommandHandler()

    // registers basic commands, like 'echo' and 'exit'
    this.setup = () => {
      this.commandHandler.on('echo', (cmd) => {
        this.writeCallback('result', "'" + cmd + "'")
      })
      this.commandHandler.on('exit', () => {
        this.writeCallback('result', config.goodbyeLine)
        this.stop()
      })
    }

    // Starts the interface with a welcome message, and creates a listener to inputStream
    this.start = () => {
      this.writeCallback('text', config.welcomeLine)
      this.commandHandler.emit('I')
      this.writeCallback('prompt')

      this.inputStream.on('data', (rawData) => {
        this.inputStream.pause()
        this.process(rawData)
        this.inputStream.resume()
      })
    }

    // Processes input from inputStream
    this.process = (rawData) => {
      let cmd = rawData.toString().trim()
      this.writeCallback('log_only', cmd)
      this.commandHandler.process(cmd)
      this.writeCallback('prompt')
    }

    // Stops the command line processor
    // Here: Only destroy the listener to inputStream
    this.stop = () => {
      this.inputStream.destroy()
    }

    // Writes input to outputStream and logStrean
    this.writeCallback = (type, text = '') => {
      let prompt = config.prompt
      let rprompt = config.rprompt
      let newLine = config.newLine
      let output = ''

      if (type === 'text') { 
        output = text + newLine 
      } else if (type === 'log_only') { 
        output = text + newLine 
      } else if (type === 'prompt') { 
        output = prompt 
      } else if (type === 'question') { 
        output = rprompt + text + newLine 
      } else if (type === 'result') { 
        output = rprompt + text + newLine 
      }

      if (type === 'log_only') {
        this.logStream.write(output)
      } else {
        this.outputStream.write(output)
        this.logStream.write(output)
      }
    }

    // Registers commands from interface object by
    // sependency injection of commandHandler and writeCallback
    this.registerInterfaceObject = (interfaceObject) => {
      this.commandHandler.registerInterfaceObject(interfaceObject, this.writeCallback)
    }
  }
}

module.exports = { CommandLineInterpreter }
