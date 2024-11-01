import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<UserResponseDto> {
    return this.usersService.getUser(userId);
  }

  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return this.usersService.deleteUser(userId);
  }
}
