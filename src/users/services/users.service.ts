import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto';

@Injectable()
export class UsersService {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      return await this.dynamoDBService.createUser(createUserDto);
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async getUser(userId: string): Promise<UserResponseDto> {
    try {
      return await this.dynamoDBService.getUser(userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.dynamoDBService.updateUser(userId, updateUserDto);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.dynamoDBService.deleteUser(userId);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
