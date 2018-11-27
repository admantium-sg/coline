const fs = require('fs')
const CommandHandler = require('./command_handler').CommandHandler
const config = require('./../config/config')

/**
 * Central object that provides input and output streams.
 * 
 * ### Constructor 
 * Creates an instance with the following variables:
 * 
 * * ``inputStream`` **Object**  - The stream that provides input data
 * * ``outputStream`` **Object** - The stream that prints out the data
 * * ``logStream`` **Object** - The stream to which log information is provided
 * * ``commandHandler`` **Object** - The command handler that listens to, and emits, events
 */
class CommandLineInterpreter {

  constructor() {
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
    /**
 * Writes input to the ``outputStream`` and ``logStream``.
 * 
 * @param {String} type - Defines how the input is written, options are 'test', 'log-_only', 'question' or 'result'
 * @param {String} cmd - The command that is written 
 */
    this.writeCallback = (type, cmd = '') => {
      let prompt = config.prompt
      let rprompt = config.rprompt
      let newLine = config.newLine
      let output = ''

      if (type === 'text') {
        output = cmd + newLine
      } else if (type === 'log_only') {
        output = cmd + newLine
      } else if (type === 'prompt') {
        output = prompt
      } else if (type === 'question') {
        output = rprompt + cmd + newLine
      } else if (type === 'result') {
        output = rprompt + cmd + newLine
      }

      if (type === 'log_only') {
        this.logStream.write(output)
      } else {
        this.outputStream.write(output)
        this.logStream.write(output)
      }
    }
  }

  /**
   * Registers basic commands, like 'echo' and 'exit'.
   */
  setup() {
    this.commandHandler.on('echo', (cmd) => {
      this.writeCallback('result', "'" + cmd + "'")
    })
    this.commandHandler.on('Exit', () => {
      this.writeCallback('result', config.goodbyeLine)
      this.stop()
    })
  }

  /**
   * Starts the command line interface.
   * * Writes the ``config.welcomeLine``
   * * Writes the interface definition
   * * Creates a listener to the ``inputStream``, that pauses the stream, calls ``process``, and resumes the stream
   */
  start() {
    this.writeCallback('text', config.welcomeLine)
    this.commandHandler.emit('I')
    this.writeCallback('prompt')

    this.inputStream.on('data', (rawData) => {
      this.inputStream.pause()
      this.process(rawData)
      this.inputStream.resume()
    })
  }

  /**
   * Processes input from ``inputStream`` by logging the message and passing it to the command handler.
   * 
   * @param {String} rawData - The raw data entered by the user
   */
  process(rawData) {
    let cmd = rawData.toString().trim()
    this.writeCallback('log_only', cmd)
    this.commandHandler.process(cmd)
    this.writeCallback('prompt')
  }

  /**
   * Stops the command line processor.
   */
  stop() {
    this.inputStream.destroy()
  }

  /**
   * Registers a new ``interfaceObject``.
   * 
   * @param {Object} interfaceObject - The interfaceObject that is registered
   */
  registerInterfaceObject(interfaceObject) {
    this.commandHandler.registerInterfaceObject(interfaceObject, this.writeCallback)
  }
}

module.exports = { CommandLineInterpreter }
