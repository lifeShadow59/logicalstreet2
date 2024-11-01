import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBClient,
  CreateTableCommand,
  DeleteTableCommand,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { getDynamoDBConfig } from 'src/config/dynamodb.config';

@Injectable()
export class DynamoDBService implements OnModuleInit {
  private readonly ddbClient: DynamoDBClient;
  private readonly ddbDocClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private readonly configService: ConfigService) {
    this.ddbClient = new DynamoDBClient(getDynamoDBConfig(configService));
    this.ddbDocClient = DynamoDBDocumentClient.from(this.ddbClient);
    this.tableName = this.configService.get('DYNAMODB_TABLE_NAME', 'users');
  }

  async onModuleInit() {
    if (this.configService.get('NODE_ENV') !== 'production') {
      await this.ensureTableExists();
    }
  }

  private async ensureTableExists() {
    try {
      const listTablesCommand = new ListTablesCommand({});
      const { TableNames } = await this.ddbClient.send(listTablesCommand);

      if (!TableNames.includes(this.tableName)) {
        await this.createTable();
      }
    } catch (error) {
      console.error('Error checking/creating table:', error);
      throw error;
    }
  }

  private async createTable() {
    const command = new CreateTableCommand({
      TableName: this.tableName,
      AttributeDefinitions: [
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' },
      ],
      KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'email-index',
          KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });

    try {
      await this.ddbClient.send(command);
      console.log(`Table ${this.tableName} created successfully`);
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  }

  async putItem(item: Record<string, any>) {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });

    try {
      return await this.ddbDocClient.send(command);
    } catch (error) {
      console.error('Error putting item:', error);
      throw error;
    }
  }

  async getItem(key: Record<string, any>) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: key,
    });

    try {
      const response = await this.ddbDocClient.send(command);
      return response.Item;
    } catch (error) {
      console.error('Error getting item:', error);
      throw error;
    }
  }

  async updateItem(key: Record<string, any>, updates: Record<string, any>) {
    const updateExpression = Object.keys(updates)
      .map((key) => `#${key} = :${key}`)
      .join(', ');

    const expressionAttributeNames = Object.keys(updates).reduce(
      (acc, key) => ({ ...acc, [`#${key}`]: key }),
      {},
    );

    const expressionAttributeValues = Object.entries(updates).reduce(
      (acc, [key, value]) => ({ ...acc, [`:${key}`]: value }),
      {},
    );

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: key,
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    try {
      const response = await this.ddbDocClient.send(command);
      return response.Attributes;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async deleteItem(key: Record<string, any>) {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: key,
    });

    try {
      return await this.ddbDocClient.send(command);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async queryByEmail(email: string) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    });

    try {
      const response = await this.ddbDocClient.send(command);
      return response.Items;
    } catch (error) {
      console.error('Error querying by email:', error);
      throw error;
    }
  }
}
