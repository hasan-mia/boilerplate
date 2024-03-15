import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import * as express from 'express';
import helmet from 'helmet';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*', credentials: true },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    '/upload',
    express.static(path.join(__dirname, '..', 'public', 'upload')),
  );
  app.use(helmet());
  await app.listen(5000);
}
bootstrap();
