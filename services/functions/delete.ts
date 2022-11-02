import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import AWS from 'aws-sdk';
import Joi from 'joi';
import StatusCode from '../statusCode';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const validators = {
  deleteSchedule: Joi.object({
    jobId: Joi.string().required(),
  }),
};

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const validation = validators.deleteSchedule.validate(event.pathParameters);
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
    await dynamoDb.delete(params).promise();

    return {
      statusCode: StatusCode.OK,
    };
  } catch (error) {
    return {
      statusCode: StatusCode.BAD_REQUEST,
      body: JSON.stringify(error),
    };
  }
};
