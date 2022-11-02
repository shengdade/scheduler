import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import AWS from 'aws-sdk';
import Joi from 'joi';
import StatusCode from '../statusCode';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const validators = {
    updateSchedule: Joi.object({
      jobId: Joi.string().required(),
      payload: Joi.string().required(),
      minute: Joi.number().required(),
      recurring: Joi.string().valid('none', 'daily', 'weekly').required(),
    }),
  };

  try {
    const body = JSON.parse(event.body || '{}');
    const input = { ...event.pathParameters, ...body };
    const validation = validators.updateSchedule.validate(input);
    if (validation.error)
      throw {
        message: validation.error.message,
      };

    const params = {
      TableName: process.env.tableName!,
      Key: {
        jobId: event.pathParameters!.jobId,
      },
      UpdateExpression:
        'SET #payload = :payload, #minute = :minute, #recurring = :recurring',
      ExpressionAttributeNames: {
        '#payload': 'payload',
        '#minute': 'minute',
        '#recurring': 'recurring',
      },
      ExpressionAttributeValues: {
        ':payload': body.payload,
        ':minute': body.minute,
        ':recurring': body.recurring,
      },
      ReturnValues: 'ALL_NEW',
    };
    const results = await dynamoDb.update(params).promise();

    return {
      statusCode: StatusCode.OK,
      body: JSON.stringify(results.Attributes),
    };
  } catch (error) {
    return {
      statusCode: StatusCode.BAD_REQUEST,
      body: JSON.stringify(error),
    };
  }
};
