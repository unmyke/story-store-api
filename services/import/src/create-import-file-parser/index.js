import { AwsEventHandlerTypes, AwsEvents } from '@lib/aws-events';

import { createImportFileParser } from './create-import-file-parser';
import { schemas } from './schemas';

export const handler = {
  eventType: AwsEvents.s3.name,
  handlerType: AwsEventHandlerTypes.SINGLE_EVENT,
  schemas,
  factory: createImportFileParser,
};
