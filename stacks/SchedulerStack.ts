import {
  Api,
  Cron,
  Queue,
  StackContext,
  Table,
} from '@serverless-stack/resources';

export function SchedulerStack({ stack }: StackContext) {
  // Create the queue
  const queue = new Queue(stack, 'Queue');

  // Create the table
  const table = new Table(stack, 'Schedules', {
    fields: {
      jobId: 'string',
      minute: 'number',
    },
    primaryIndex: { partitionKey: 'jobId' },
    globalIndexes: {
      minuteIndex: { partitionKey: 'minute', sortKey: 'jobId' },
    },
  });

  // Create the HTTP API
  const api = new Api(stack, 'Api', {
    defaults: {
      function: {
        environment: {
          tableName: table.tableName,
          queueUrl: queue.queueUrl,
        },
      },
    },
    routes: {
      'GET    /schedules': 'functions/list.main',
      'POST   /schedules': 'functions/create.main',
      'GET    /schedules/{jobId}': 'functions/get.main',
      'PUT    /schedules/{jobId}': 'functions/update.main',
      'DELETE /schedules/{jobId}': 'functions/delete.main',
    },
  });

  // Create the Cron job
  const cron = new Cron(stack, 'Cron', {
    schedule: 'rate(1 minute)',
    job: {
      function: {
        handler: 'functions/cron.main',
        environment: {
          tableName: table.tableName,
          queueUrl: queue.queueUrl,
        },
      },
    },
  });

  // Allow the API to access the table and the queue
  api.attachPermissions([table, queue]);

  // Allow the Cron job to access the table and the queue
  cron.attachPermissions([table, queue]);

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
