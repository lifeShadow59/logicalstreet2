import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(public validationErrors: Record<string, string[]>) {
    super({
      statusCode: 400,
      error: 'Validation Failed',
      validation: validationErrors,
    });
  }
}
