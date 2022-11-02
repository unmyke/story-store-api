import { product as productSchema } from '../../schemas';

import request from './request.json';
import requestParams from './request-params.json';
import response from './response.json';
import response200 from './response-200.json';

export const schemas = {
  request: { schema: request, references: [requestParams] },
  response: { schema: response, references: [response200, productSchema] },
};
