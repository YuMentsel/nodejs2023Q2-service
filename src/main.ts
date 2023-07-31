import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { load } from 'js-yaml';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 4000);

  const file = readFileSync(join('doc', 'api.yaml'), 'utf8');
  const document = load(file) as OpenAPIObject;
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    console.log(
      `Server is running on port ${port}. Go to http://localhost:${port}`,
    ),
      console.log(`OpenAPI: http://localhost:${port}/doc`);
  });
}
bootstrap();
