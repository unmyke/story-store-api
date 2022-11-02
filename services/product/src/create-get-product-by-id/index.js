import { createGetProductById } from './create-get-product-by-id';
import { schemas } from './schemas';

export const handler = {
  schemas,
  factory: createGetProductById,
};
