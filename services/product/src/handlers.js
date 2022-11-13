import { createEventHandlers } from '@lib/create-event-handlers';
import { createDb } from '@lib/create-db';
import { createNotifier } from '@lib/create-notifier';
import { ConfigSections, createConfig } from '@lib/create-config';

import { handler as createCatalogBatchProcess } from './create-catalog-batch-process';
import { handler as createCreateProduct } from './create-create-product';
import { handler as createGetProductById } from './create-get-product-by-id';
import { handler as createGetProductList } from './create-get-product-list';
import { createRepo } from './create-repo';

const config = createConfig(ConfigSections.DB, ConfigSections.NOTIFIER);
const db = createDb(config[ConfigSections.DB]);
const repo = createRepo({ db });
const notifier = createNotifier(config[ConfigSections.NOTIFIER]);
const handlerConfig = { topics: config[ConfigSections.NOTIFIER].topics };

export const {
  catalogBatchProcess,
  createProduct,
  getProductById,
  getProductList,
} = createEventHandlers({
  handlers: {
    catalogBatchProcess: createCatalogBatchProcess,
    createProduct: createCreateProduct,
    getProductById: createGetProductById,
    getProductList: createGetProductList,
  },
  context: { config: handlerConfig, repo, notifier },
});
