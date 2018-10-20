const fs = require('fs')
const EventEmitter = require('events')
const AbstractCommandLineInterface = require('./abstract_interfaces').AbstractCommandLineInterface

class Handler extends EventEmitter {}

class CommandLineInterface extends AbstractCommandLineInterface {
  constructor () {
    super()
    this.inputStream = process.stdin
    this.outputStream = process.stdout
    this.logStream = {
      write: (text) => {
        fs.appendFileSync( './mystl.log', text, (err) => {
          if (err) throw err
        })
      }
    }
    this.commandHandler = new Handler()
    this.contextObject = null
    this.setupCommands()
  }

  start() {
    this.write('text', new Date().toISOString() + ' Mystery Lunch Planner')
    this.write('prompt')
    
    this.inputStream.on('data', (rawData) => {
      this.inputStream.pause()
      this.handleCommand(rawData)
      this.inputStream.resume()
    })
  }

  handleCommand (rawData) {
    let cmd = rawData.toString().trim()
    this.write('log_only', cmd)

    // If context objectt exists, emit event creation with cmd as input
    // ELSE send cmd as Event code
    // FINALLY default to echo
    if (this.contextObject) {
      this.commandHandler.emit('event_creation', cmd)
    } else if (!this.commandHandler.emit(cmd, cmd)) {
      this.commandHandler.emit('default', cmd)
    };
    this.write('prompt')
  }

  setupCommands () {
    this.commandHandler.on('default', (cmd) => {
      this.write('result',"'" + cmd + "'")
    })
    this.commandHandler.on('M', () => {
      LunchEvent.getInterfaceMenu().forEach(item => this.write('result',item))
    })
    this.commandHandler.on('S', () => {
      for (let event of this.lunch_events) {
        event.printData().forEach(item =>this.write('result','--- ' + item))
      }
    })
    this.commandHandler.on('C', () => {
      // Bind new lunch event to context object
      this.contextObject = new LunchEvent()
      // Print first message of context object
      this.writeQuestion(this.contextObject.nextQuestion())
    })
    this.commandHandler.on('event_creation', (cmd) => {
      this.contextObject.answerQuestion(cmd)
      // IF incomplete print out next question
      // ELSE Add created object and reset context object
      if (!this.contextObject.isComplete()) {
        this.writeQuestion(this.contextObject.nextQuestion())
      } else {
        this.addEvent(this.contextObject)
       this.write('result',this.contextObject.getSuccessMessage())
        this.contextObject = null
      }
    })
    this.commandHandler.on('exit', () => {
      this.inputStream.destroy()
    })
  }

  addEvent (lunch_event = Object) {
    this.lunch_events.push(lunch_event)
  }

  write(type, text = '') {
    //console.log("+++ WRITE Called with TYPE +" + type + "+ / TEXT +" + text + "+")
    let prompt = '$: ', rprompt = '$> ', nl = '\r\n', output = ''

    if  (type === 'text') { output = text + nl }
    else if (type === 'log_only') {output = text + nl }
    else if (type === 'prompt') { output = prompt }
    else if (type === 'question' ) { output = rprompt + text + nl}
    else if (type === 'result') { output = rprompt + text + nl }
    
    //console.log("+++ Logging ''" + output + "'")
    if (!(type === 'log_only')) {
      this.outputStream.write(output)
    }
    this.logStream.write(output)
  }
}

module.exports = { CommandLineInterface }
