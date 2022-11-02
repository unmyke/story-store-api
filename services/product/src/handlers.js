import { db } from '@lib/mock-db';
import { createGatewayHandlers } from '@lib/create-gateway-handlers';

import { handler as createGetProductById } from './create-get-product-by-id';
import { handler as createGetProductList } from './create-get-product-list';
import { createQuery } from './create-query';

export const { getProductById, getProductList } = createGatewayHandlers({
  handlers: {
    getProductById: createGetProductById,
    getProductList: createGetProductList,
  },
  context: { query: createQuery({ db }) },
});
