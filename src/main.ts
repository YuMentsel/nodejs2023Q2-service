import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

const PORT = +process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 4000);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, () =>
    console.log(
      `Server is running on port ${port}. Go to http://localhost:${port}`,
    ),
  );
}
bootstrap();
