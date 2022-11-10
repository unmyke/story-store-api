import { AwsEventHandlerTypes, AwsEvents } from '@lib/aws-events';

import { createImportProductsFile } from './create-import-products-file';
import { schemas } from './schemas';

export const handler = {
  eventType: AwsEvents['http-api'].name,
  handlerType: AwsEventHandlerTypes.SINGLE_EVENT,
  schemas,
  factory: createImportProductsFile,
};
