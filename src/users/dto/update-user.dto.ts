import { IsString, IsEmail, IsDateString, IsOptional } from 'class-validator';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;
}
