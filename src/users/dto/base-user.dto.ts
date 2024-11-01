import {
  IsString,
  IsEmail,
  IsDateString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAdult,
  IsNotFutureDate,
} from '../../common/decorators/custom-validators';

export class BaseUserDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  @Matches(/^[a-zA-Z\s-']+$/, {
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The date of birth of the user (must be 18 or older)',
    example: '1990-01-01',
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'Please provide a valid date in YYYY-MM-DD format' },
  )
  @IsAdult(18, { message: 'User must be at least 18 years old' })
  @IsNotFutureDate({ message: 'Date of birth cannot be in the future' })
  dob: string;
}
