import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const timestamp = new Date().toISOString();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error!';

    const { httpAdapter } = this.httpAdapterHost;
    const path = httpAdapter.getRequestUrl(request);

    this.logger.error(
      `${request.method} ${statusCode} ${message}`,
      (exception as HttpException).stack,
    );

    const responseBody = { statusCode, timestamp, path, message };
    httpAdapter.reply(response, responseBody, statusCode);
  }
}
