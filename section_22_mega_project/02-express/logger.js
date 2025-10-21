import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;

// custom format for console logging with colors
const consoleLoggerFormat = combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// create a winston logger
const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      level: "info",
      format: consoleLoggerFormat,
    }),
    new transports.File({filename: 'app.log'}),
  ],
});

export default logger;
