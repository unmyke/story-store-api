import {
  productList as productListSchema,
  product as productSchema,
} from '../../schemas';

import request from './request.json';
import requestQuery from './request-query.json';
import response from './response.json';
import response200 from './response-200.json';

export const schemas = {
  request: { schema: request, references: [requestQuery] },
  response: {
    schema: response,
    references: [response200, productSchema, productListSchema],
  },
};
