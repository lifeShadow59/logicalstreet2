import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamoDBService } from './services/dynamodb.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DynamoDBService,
      useFactory: (configService: ConfigService) => {
        return new DynamoDBService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DynamoDBService],
})
export class DynamoDBModule {}
