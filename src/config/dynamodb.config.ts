import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';

export const getDynamoDBConfig = (
  configService: ConfigService,
): DynamoDBClientConfig => {
  const isLocal = configService.get('NODE_ENV') !== 'production';

  if (isLocal) {
    return {
      region: 'local',
      endpoint: 'http://localhost:8000',
      credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local',
      },
    };
  }

  return {
    region: configService.get('AWS_REGION'),
    credentials: {
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  };
};
