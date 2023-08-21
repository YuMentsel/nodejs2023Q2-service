import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CustomLoggingMiddleware implements NestMiddleware {
  private logger = new Logger(CustomLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} Query: ${JSON.stringify(
          query,
        )}, Body: ${JSON.stringify(body)}`,
      );
    });
    next();
  }
}
