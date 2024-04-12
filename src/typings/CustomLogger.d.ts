import { Logger as WinstonLogger } from 'winston';

interface CustomLogger extends WinstonLogger {
  fatal: (message: string) => void;
  success: (message: string) => void;
}
