import winston, { createLogger, format, transports } from 'winston';
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
    error: 1,
    warn: 2,
    info: 3,
  },
  colors: {
    error: 'red',
    warn: 'orange',
    info: 'green',
  },
};

winston.addColors(customLevels.colors);

const logFormat = printf(({ timestamp, level, message, stack }) => {
  return `[${timestamp}] [${level}]: ${stack || message}`;
});

const logger = createLogger({
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
});

export default logger;

