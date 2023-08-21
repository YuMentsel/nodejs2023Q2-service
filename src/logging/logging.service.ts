import { ConsoleLogger, Injectable } from '@nestjs/common';
import { parse, resolve } from 'path';
import { LogLevels, LogFiles } from './enums';
import { existsSync } from 'fs';
import { appendFile, writeFile, mkdir, stat } from 'fs/promises';

@Injectable()
export class CustomLoggingService extends ConsoleLogger {
  private level: number;
  private maxSize: number;

  constructor() {
    super();
    this.level = +process.env.LOG_LEVEL || 2;
    this.maxSize = +process.env.MAX_LOG_SIZE || 1024;
  }

  log(message: string, context: string) {
    if (this.level >= 2)
      this.writeToLog(LogLevels.log, `${message}`, context || this.context);
  }

  error(message: string, trace: string, context?: string) {
    if (this.level >= 0)
      this.writeToLog(
        LogLevels.error,
        `${message}\n${trace}`,
        context || this.context,
      );
  }

  warn(message: string, context: string) {
    if (this.level >= 1)
      this.writeToLog(LogLevels.warn, `${message}`, context || this.context);
  }

  debug(message: string, context: string) {
    if (this.level >= 4)
      this.writeToLog(LogLevels.debug, `${message}`, context || this.context);
  }

  verbose(message: string, context: string) {
    if (this.level >= 3)
      this.writeToLog(LogLevels.verbose, `${message}`, context || this.context);
  }

  private async writeToLog(level: string, message: string, context: string) {
    const logMessage = `[${this.getTimestamp()}] [${level.toUpperCase()}] - [${
      context || ''
    }] - [${message}]\n`;

    super[level](logMessage);

    let count = 1;
    let errorCount = 1;

    level === LogLevels.error
      ? (errorCount = await this.writeToFile(
          errorCount,
          logMessage,
          LogFiles.errLogFile,
        ))
      : (count = await this.writeToFile(count, logMessage, LogFiles.logFile));
  }

  private async writeToFile(count: number, message: string, file: string) {
    if (!existsSync(LogFiles.dirPath)) await mkdir(LogFiles.dirPath);
    let filePath = resolve(LogFiles.dirPath, `${count}.${file}`);
    if (!existsSync(filePath)) await writeFile(filePath, '');

    const { size } = await stat(filePath);
    if (size / 1024 > this.maxSize) count++;

    filePath = resolve(LogFiles.dirPath, `${count}.${file}`);
    await writeFile(filePath, message, { flag: 'a' });
    return count;
  }
}
