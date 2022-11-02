import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import AWS from 'aws-sdk';
import Joi from 'joi';
import StatusCode from '../statusCode';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const validators = {
  getSchedule: Joi.object({
    jobId: Joi.string().required(),
  }),
};

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const validation = validators.getSchedule.validate(event.pathParameters);
    if (validation.error)
      throw {
        message: validation.error.message,
      };

    const params = {
      TableName: process.env.tableName!,
      Key: {
        jobId: event.pathParameters!.jobId,
      },
    };
    const results = await dynamoDb.get(params).promise();

    return results.Item
      ? {
          statusCode: StatusCode.OK,
          body: JSON.stringify(results.Item),
        }
      : {
          statusCode: StatusCode.NOT_FOUND,
          body: JSON.stringify({ error: 'Item Not Found' }),
        };
  } catch (error) {
    return {
      statusCode: StatusCode.BAD_REQUEST,
      body: JSON.stringify(error),
    };
  }
};
