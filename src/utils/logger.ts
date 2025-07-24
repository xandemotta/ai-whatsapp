import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export class Logger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxFiles: '14d',
        }),
        new winston.transports.Console(),
      ],
    });
  }

  log(message: any) {
    this.logger.info(message);
  }
  error(message: any, trace?: string) {
    this.logger.error(message, trace);
  }
  warn(message: any) {
    this.logger.warn(message);
  }
  debug?(message: any) {
    this.logger.debug(message);
  }
  verbose?(message: any) {
    this.logger.verbose(message);
  }
}
