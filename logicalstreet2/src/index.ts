// src/main.firebase.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationError } from 'class-validator';
import { ValidationException } from './common/exceptions/validation.exception';
import * as express from 'express';
import * as functions from 'firebase-functions';

const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  // Enable CORS
  app.enableCors();

  // Enable validation pipes (keeping your existing configuration)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.reduce((acc, err) => {
          acc[err.property] = Object.values(err.constraints);
          return acc;
        }, {});

        return new ValidationException(formattedErrors);
      },
    }),
  );

  // Global Exception Filter (keeping your existing filter)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger setup (keeping your existing configuration)
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('CRUD API for managing users')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  return app.init();
};

// Initialize the server on cold start
createNestServer(server)
  .then(() => console.log('Nest Ready'))
  .catch(err => console.error('Nest broken', err));

// Export the cloud function
export const api = functions.https.onRequest(server);

// Optional: You can add region specification if needed
// export const api = functions.region('us-central1').https.onRequest(server);