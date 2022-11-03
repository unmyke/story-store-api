import { schemas } from './schemas';
import { createCreateProduct } from './create-create-product';

export const handler = {
  schemas,
  factory: createCreateProduct,
};
