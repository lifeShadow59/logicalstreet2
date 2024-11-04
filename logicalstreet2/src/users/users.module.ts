import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBModule } from 'src/dynamodb/dynamodb.module';

@Module({
  imports: [ConfigModule, DynamoDBModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
