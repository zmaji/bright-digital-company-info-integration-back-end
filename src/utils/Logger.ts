import winston, { createLogger, format, transports } from 'winston';
import { CustomLogger } from '../typings/CustomLogger';
const {
  combine,
  timestamp,
  printf,
  colorize,
  prettyPrint,
  errors,
} = format;

const customLevels = {
  levels: {
    fatal: 1,
    error: 2,
    warn: 3,
    success: 4,
    info: 5,
  },
  colors: {
    fatal: 'redBG',
    error: 'red',
    warn: 'yellow',
    success: 'green',
    info: 'blue',
  },
};

winston.addColors(customLevels.colors);

const logFormat = printf(({ timestamp, level, message, stack }) => {
  return `[${timestamp}] [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    logFormat,
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        logFormat,
      ),
    }),
    new transports.File({
      filename: './Logs/application.log',
      format: combine(
        prettyPrint(),
        logFormat,
      ),
      options: { flags: 'a' },
    }),
  ],
}) as CustomLogger;

export default logger;

