import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';
import { IsUUID, IsISO8601 } from 'class-validator';

export class UserResponseDto extends BaseUserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The timestamp when the user was created',
    example: '2024-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsISO8601()
  createdAt: string;

  @ApiProperty({
    description: 'The timestamp when the user was last updated',
    example: '2024-01-01T00:00:00.000Z',
    format: 'date-time',
  })
  @IsISO8601()
  updatedAt: string;
}
