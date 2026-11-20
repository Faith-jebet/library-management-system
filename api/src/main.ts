import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // drops any fields not declared in the DTO
      transform: true, // converts types, e.g. query "?page=2" becomes the number 2
    }),
  );
  app.enableCors(); // allows browsers on other addresses (like a React app) to call this API
  await app.listen(3000);
}
bootstrap();