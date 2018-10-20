class AbstractCommandLineInterface {
    constructor() {
        this.inputStreams
        this.outputStreams
        this.commandHandler
        this.prompt
        this.contextObject

        this.setup = () => { }
        this.start = () => { }
        this.stop = () => { }

        this.writeLine = (type) => { }
    }
}

class AbstractContextObject {
    constructor() {
        this.contextObject
        this.commandRegistry

        this.getInterface = () => { }
        this.nextQuestion = () => { }
        this.answerQuestion = () => { }
        this.finalize = () => { return "Success message" }
        this.isComplete = () => { }
        this.ejectCommands = () => { }
    }
}

class AbstractCommand {
    constructor(key, func) {
        this.key
        this.func
    }
}

module.exports = { AbstractCommandLineInterface, AbstractContextObject, AbstractCommand}

