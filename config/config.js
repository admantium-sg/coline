const config = {
    inputStream: process.stdin,
    outputStream: process.stdout,

    logFile:  './mystl.log',
    storeFile: './mystl.json',

    prompt: '$: ',
    rprompt: '$> ',
    newLine: '\r\n',

    welcomeLine: new Date().toISOString() + ' Mystery Lunch Planner',
    goodbyeLine: 'Exiting. Thank you for using the Mystery Lunch Planner'
}

module.exports = config
