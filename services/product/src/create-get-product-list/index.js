import { AwsEvents } from '@lib/aws-events';

import { createGetProductList } from './create-get-product-list';
import { schemas } from './schemas';

export const handler = {
  eventType: AwsEvents['http-api'].name,
  schemas,
  factory: createGetProductList,
};
