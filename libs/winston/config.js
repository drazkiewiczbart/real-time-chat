const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prettyPrint()),
  transports: [new transports.File({ filename: './logs/logs.log' })],
  exitOnError: true,
  silent: false,
});

module.exports = {
  logger,
};
