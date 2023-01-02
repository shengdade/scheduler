import { App } from '@serverless-stack/resources';
import { RemovalPolicy } from 'aws-cdk-lib';
import { SchedulerStack } from './SchedulerStack';

export default function (app: App) {
  // Remove all resources when non-prod stages are removed
  if (app.stage !== 'prod') {
    app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
  }
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'services',
    bundle: {
      format: 'esm',
    },
  });
  app.stack(SchedulerStack);
}
