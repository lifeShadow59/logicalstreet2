import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DynamoDBService } from './services/dynamodb.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DynamoDBService],
})
export class UsersModule {}
