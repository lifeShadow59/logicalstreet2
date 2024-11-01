export default () => ({
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    dynamodb: {
      tableName: process.env.DYNAMODB_TABLE || 'users-table',
    },
  },
});
