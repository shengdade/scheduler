import AWS from 'aws-sdk';
import StatusCode from '../statusCode';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main() {
  const params = {
    TableName: process.env.tableName!,
  };
  const results = await dynamoDb.scan(params).promise();

  return {
    statusCode: StatusCode.OK,
    body: JSON.stringify(results.Items),
  };
}
