import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService  extends ConsoleLogger implements LoggerService {
  constructor(context: string) {
    super(context);
  }

  log(message: string) {
    super.log(this.format(message));
  }

  error(message: string) {
    super.error(this.format(message))
  }

  warn(message: string) {
    super.warn(this.format(message));
  }

  debug(message: string) {
    super.debug(this.format(message));
  }

  verbose(message: string) {
    super.verbose(this.format(message));
  }

  format(message: string): string {
    return `${this.context} - ${message}`;
  }
}