import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { load } from 'js-yaml';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './filters/exceptions.filter';
import { CustomLoggingService } from './logging/logging.service';

const addLogListeners = (logger: CustomLoggingService): void => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(
      'Unhandled Rejection:',
      reason instanceof Error ? reason.stack : String(reason),
    );
    process.exit(1);
  });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  const logger = app.get(CustomLoggingService);
  app.useLogger(logger);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapterHost));

  addLogListeners(logger);

  const port = configService.get('PORT', 4000);

  const file = await readFile(join(__dirname, '..', 'doc', 'api.yaml'), 'utf8');
  const document = load(file) as OpenAPIObject;
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port, () => {
    console.log(
      `Server is running on port ${port}. Go to http://localhost:${port}`,
    ),
      console.log(`OpenAPI: http://localhost:${port}/doc`);
  });
}
bootstrap();
