import { createGetProductList } from './create-get-product-list';
import { schemas } from './schemas';

export const handler = {
  schemas,
  factory: createGetProductList,
};
