import { createGatewayHandlers } from '@lib/create-gateway-handlers';
import { createDb } from '@lib/create-db';
import { createConfig } from '@lib/create-config';

import { handler as createGetProductById } from './create-get-product-by-id';
import { handler as createGetProductList } from './create-get-product-list';
import { createRepo } from './create-repo';

const config = createConfig();
const db = createDb(config.db);

export const { getProductById, getProductList } = createGatewayHandlers({
  handlers: {
    getProductById: createGetProductById,
    getProductList: createGetProductList,
  },
  context: { repo: createRepo({ db }) },
});
