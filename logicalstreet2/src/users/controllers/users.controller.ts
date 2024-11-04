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
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto';
import { UserValidationPipe } from 'src/common/pipes/user-validation.pipe';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
  })
  @ApiConflictResponse({
    description: 'Email already exists.',
  })
  @UsePipes(new UserValidationPipe())
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully retrieved.',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  async getUser(@Param('userId') userId: string): Promise<UserResponseDto> {
    return this.usersService.getUser(userId);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully updated.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The user has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return this.usersService.deleteUser(userId);
  }
}
