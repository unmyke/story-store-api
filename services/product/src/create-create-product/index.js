import { AwsEvents } from '@lib/aws-events';

import { schemas } from './schemas';
import { createCreateProduct } from './create-create-product';

export const handler = {
  eventType: AwsEvents['http-api'].name,
  schemas,
  factory: createCreateProduct,
};
