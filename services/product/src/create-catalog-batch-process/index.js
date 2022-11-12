import { AwsEventHandlerTypes, AwsEvents } from '@lib/aws-events';

import { schemas } from './schemas';
import { createCatalogBatchProcess } from './create-catalog-batch-process';

export const handler = {
  eventType: AwsEvents.sqs.name,
  handlerType: AwsEventHandlerTypes.MULTIPLE_EVENTS,
  schemas,
  factory: createCatalogBatchProcess,
};
