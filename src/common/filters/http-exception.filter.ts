import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions/validation.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (exception instanceof ValidationException) {
      return response.status(status).json({
        statusCode: status,
        error: 'Validation Failed',
        validation: exception.validationErrors,
        timestamp: new Date().toISOString(),
      });
    }

    response.status(status).json({
      statusCode: status,
      error: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
