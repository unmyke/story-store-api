import { product as productSchema } from '../../schemas';

import event from './event.json';
import eventParams from './event-params.json';
import response from './response.json';
import response200 from './response-200.json';

export const schemas = {
  event: { schema: event, references: [eventParams] },
  response: { schema: response, references: [response200, productSchema] },
};
