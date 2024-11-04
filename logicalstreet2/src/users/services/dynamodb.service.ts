// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { DynamoDB } from 'aws-sdk';
// import { v4 as uuidv4 } from 'uuid';
// import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto';

// @Injectable()
// export class DynamoDBService {
//   private readonly docClient: DynamoDB.DocumentClient;
//   private readonly tableName: string;

//   constructor(private configService: ConfigService) {
//     this.docClient = new DynamoDB.DocumentClient({
//       region: this.configService.get<string>('aws.region'),
//     });
//     this.tableName = this.configService.get<string>('aws.dynamodb.tableName');
//   }

//   async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
//     const timestamp = new Date().toISOString();
//     const user = {
//       userId: uuidv4(),
//       ...createUserDto,
//       createdAt: timestamp,
//       updatedAt: timestamp,
//     };

//     await this.docClient
//       .put({
//         TableName: this.tableName,
//         Item: user,
//         ConditionExpression: 'attribute_not_exists(email)',
//       })
//       .promise();

//     return user;
//   }

//   async getUser(userId: string): Promise<UserResponseDto> {
//     const result = await this.docClient
//       .get({
//         TableName: this.tableName,
//         Key: { userId },
//       })
//       .promise();

//     if (!result.Item) {
//       throw new Error('User not found');
//     }

//     return result.Item as UserResponseDto;
//   }

//   async updateUser(
//     userId: string,
//     updateUserDto: UpdateUserDto,
//   ): Promise<UserResponseDto> {
//     const timestamp = new Date().toISOString();
//     let updateExpression = 'set updatedAt = :timestamp';
//     const expressionAttributeValues: any = {
//       ':timestamp': timestamp,
//     };
//     const expressionAttributeNames: any = {};

//     if (updateUserDto.name) {
//       updateExpression += ', #name = :name';
//       expressionAttributeValues[':name'] = updateUserDto.name;
//       expressionAttributeNames['#name'] = 'name';
//     }

//     if (updateUserDto.email) {
//       updateExpression += ', email = :email';
//       expressionAttributeValues[':email'] = updateUserDto.email;
//     }

//     if (updateUserDto.dob) {
//       updateExpression += ', dob = :dob';
//       expressionAttributeValues[':dob'] = updateUserDto.dob;
//     }

//     const result = await this.docClient
//       .update({
//         TableName: this.tableName,
//         Key: { userId },
//         UpdateExpression: updateExpression,
//         ExpressionAttributeValues: expressionAttributeValues,
//         ExpressionAttributeNames: expressionAttributeNames,
//         ReturnValues: 'ALL_NEW',
//       })
//       .promise();

//     return result.Attributes as UserResponseDto;
//   }

//   async deleteUser(userId: string): Promise<void> {
//     await this.docClient
//       .delete({
//         TableName: this.tableName,
//         Key: { userId },
//         ConditionExpression: 'attribute_exists(userId)',
//       })
//       .promise();
//   }
// }
