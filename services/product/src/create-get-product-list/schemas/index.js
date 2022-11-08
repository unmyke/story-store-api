import {
  productList as productListSchema,
  product as productSchema,
} from '../../schemas';

import event from './event.json';
import eventQuery from './event-query.json';
import response from './response.json';
import response200 from './response-200.json';

export const schemas = {
  event: { schema: event, references: [eventQuery] },
  response: {
    schema: response,
    references: [response200, productSchema, productListSchema],
  },
};
