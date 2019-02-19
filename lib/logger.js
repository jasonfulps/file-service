const config = require('../config');
const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf, colorize} = format;

// Formatting
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// Create logger
const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({filename:config.logger.file})
    ],
    format: combine(
        colorize(),
        timestamp(),
        myFormat
    )
});
module.exports = logger;