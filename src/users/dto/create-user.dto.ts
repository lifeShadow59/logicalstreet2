import { IsString, IsEmail, IsDateString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsDateString()
  dob: string;
}
