import { product as productSchema } from '../../schemas';

import sqsEvent from './event.json';

export const schemas = {
  event: { schema: sqsEvent, references: [productSchema] },
};
