import { AwsEvents } from '@lib/aws-events';

import { createGetProductById } from './create-get-product-by-id';
import { schemas } from './schemas';

export const handler = {
  eventType: AwsEvents['http-api'].name,
  schemas,
  factory: createGetProductById,
};
