import { db } from '@lib/mock-db';
import { createGatewayHandlers } from '@lib/create-gateway-handlers';

import { createGetProductById } from './create-get-product-by-id';
import { createGetProductList } from './create-get-product-list';
import { createQuery } from './create-query';

export const { getProductById, getProductList } = createGatewayHandlers({
  handlers: {
    getProductById: createGetProductById,
    getProductList: createGetProductList,
  },
  context: { query: createQuery({ db }) },
});
