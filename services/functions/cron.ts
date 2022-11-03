import AWS from 'aws-sdk';
import { getNowInMinute } from 'utils';
import * as uuid from 'uuid';

type AttributeMap = AWS.DynamoDB.DocumentClient.AttributeMap;

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export const main = async () => {
  const nowInMinute = getNowInMinute();
  const params = {
    TableName: process.env.tableName!,
    IndexName: 'minuteIndex',
    KeyConditionExpression: '#minute = :minute',
    ExpressionAttributeNames: {
      '#minute': 'minute',
    },
    ExpressionAttributeValues: {
      ':minute': nowInMinute,
    },
  };
  const results = await dynamoDb.query(params).promise();
  const jobs = results.Items;

  if (jobs && jobs.length > 0) {
    await Promise.all(jobs.map((job) => processJob(job)));
  } else {
    console.log(`No job scheduled at ${nowInMinute}`);
  }
};

const processJob = async (item: AttributeMap): Promise<void> => {
  console.log(item);
  await sqs
    .sendMessage({
      QueueUrl: process.env.queueUrl!,
      MessageBody: item.payload,
    })
    .promise();
  await deleteCurrentSchedule(item);
  switch (item.recurring) {
    case 'daily':
      await generateNextSchedule(item, 24 * 60);
      break;
    case 'weekly':
      await generateNextSchedule(item, 7 * 24 * 60);
      break;
  }
};

const generateNextSchedule = async (item: AttributeMap, length: number) => {
  const params = {
    TableName: process.env.tableName!,
    Item: {
      jobId: uuid.v1(),
      payload: item.payload,
      minute: Number(item.minute) + length,
      recurring: item.recurring,
    },
  };
  await dynamoDb.put(params).promise();
};

const deleteCurrentSchedule = async (item: AttributeMap) => {
  const params = {
    TableName: process.env.tableName!,
    Key: {
      jobId: item.jobId,
    },
  };
  await dynamoDb.delete(params).promise();
};
