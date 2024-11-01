import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
// import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBService } from 'src/dynamodb/services/dynamodb.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto';

@Injectable()
export class UsersService {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if email already exists
    const existingUsers = await this.dynamoDBService.queryByEmail(
      createUserDto.email,
    );
    if (existingUsers && existingUsers.length > 0) {
      throw new ConflictException('Email already exists');
    }

    const timestamp = new Date().toISOString();
    const newUser = {
      userId: uuidv4(),
      ...createUserDto,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.dynamoDBService.putItem(newUser);
    return newUser;
  }

  async getUser(userId: string): Promise<UserResponseDto> {
    const user = await this.dynamoDBService.getItem({ userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user as UserResponseDto;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Check if user exists
    await this.getUser(userId);

    // Check email uniqueness if email is being updated
    if (updateUserDto.email) {
      const existingUsers = await this.dynamoDBService.queryByEmail(
        updateUserDto.email,
      );
      if (
        existingUsers &&
        existingUsers.length > 0 &&
        existingUsers[0].userId !== userId
      ) {
        throw new ConflictException('Email already exists');
      }
    }

    const updates = {
      ...updateUserDto,
      updatedAt: new Date().toISOString(),
    };

    const updatedUser = await this.dynamoDBService.updateItem(
      { userId },
      updates,
    );

    return updatedUser as UserResponseDto;
  }

  async deleteUser(userId: string): Promise<void> {
    // Check if user exists
    await this.getUser(userId);

    await this.dynamoDBService.deleteItem({ userId });
  }
}
