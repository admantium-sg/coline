const fs = require('fs')
const EventEmitter = require('events')

const AbstractCommandLineInterpreter = require('./abstract_interfaces').AbstractCommandLineInterpreter

class CommandHandler extends EventEmitter {
  constructor () {
    super()
    this.contextObject = null
    this.interfaceObjects = []
    this.setContextObject = (object) => { this.contextObject = object }
    this.resetContextObject = () => { this.contextObject = null }
  }

  process(cmd) {
    // emit cmd, if not handled then echo
    if (this.contextObject !== null) {
      this.emit('context', cmd)
    } else if (!this.emit(cmd, cmd)) {
      this.emit('echo', cmd)
    }
  }

  registerInterfaceObject(interfaceObject, writeCallback) {
    console.log("Registering IOB")
    let iob = new interfaceObject(this, writeCallback)
    console.log("Instance Created")
    console.log(iob)
    this.interfaceObjects.push(iob)
    iob.registerCommands()
  }
}

class CommandLineInterpreter extends AbstractCommandLineInterpreter {
  // Provides bindings for all variables from the abstract class
  constructor () {
    super()
    this.inputStream = process.stdin
    this.outputStream = process.stdout
    this.logStream = {
      write: (text) => {
        fs.appendFileSync('./mystl.log', text, (err) => {
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
        this.writeCallback('result', 'Exiting. Thank you for using the Mystery Lunch Planner')
        this.stop()
      })
    }

    // Starts the interface with a welcome message, and creates a listener to inputStream
    this.start = () => {
      this.writeCallback('text', new Date().toISOString() + ' Mystery Lunch Planner')
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
      let prompt = '$: '; let rprompt = '$> '; let nl = '\r\n'; let output = ''

      if (type === 'text') { output = text + nl } else if (type === 'log_only') { output = text + nl } else if (type === 'prompt') { output = prompt } else if (type === 'question') { output = rprompt + text + nl } else if (type === 'result') { output = rprompt + text + nl }

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
