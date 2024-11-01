import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import dynamodbConfiguration from './config/dynamodb.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dynamodbConfiguration],
      isGlobal: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
