import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import AWS from 'aws-sdk';
import Joi from 'joi';
import * as uuid from 'uuid';
import StatusCode from '../statusCode';
import { getNowInMinute } from '../utils';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const validators = {
    createSchedule: Joi.object({
      payload: Joi.string().required(),
      minute: Joi.number().required(),
      recurring: Joi.string().valid('none', 'daily', 'weekly').required(),
    }),
  };

  try {
    const body = JSON.parse(event.body || '{}');
    const validation = validators.createSchedule.validate(body);
    if (validation.error)
      throw {
        message: validation.error.message,
      };

    if (body.minute === getNowInMinute() - 1) {
      await sqs
        .sendMessage({
          QueueUrl: process.env.queueUrl!,
          MessageBody: body.payload,
        })
        .promise();
      return {
        statusCode: StatusCode.OK,
      };
    }

    const params = {
      TableName: process.env.tableName!,
      Item: {
        jobId: uuid.v1(),
        payload: body.payload,
        minute: body.minute,
        recurring: body.recurring,
      },
    };
    await dynamoDb.put(params).promise();

    return {
      statusCode: StatusCode.OK,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    return {
      statusCode: StatusCode.BAD_REQUEST,
      body: JSON.stringify(error),
    };
  }
};
