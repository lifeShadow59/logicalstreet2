import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBModule } from './dynamodb/dynamodb.module';

@Module({
  imports: [ConfigModule.forRoot(), DynamoDBModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
