class AbstractCommandLineInterface {
    constructor() {
        this.inputStream
        this.outputStream
        this.commandHandler
        this.prompt
        this.contextObject
    }
    setup() {}
    start()  {}
    stop() {}
    write(type, text) {}
}

class AbstractContextObject {
    constructor() {
        this.contextObject
        this.commandRegistry
    }

    getInterface () {}
    nextQuestion () {}
    answerQuestion () {}
    finalize () { return "Success message" }
    isComplete () {}
    ejectCommands () {}
}

class AbstractCommand {
    constructor(key, func) {
        this.key
        this.func
    }
}

module.exports = { AbstractCommandLineInterface, AbstractContextObject, AbstractCommand}

