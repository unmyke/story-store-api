import { v4 as uuid } from 'uuid';
import { Errors } from '@lib/errors';

export const createCatalogBatchProcess =
  ({ repo }) =>
  async (events) => {
    const products = events.map(toProduct);
    try {
      await repo.createProducts(products);
      return { productIds: products.map(({ id }) => id) };
    } catch (error) {
      throw new Errors.Domain(
        'An error occured when try to create batch of products',
        error,
      );
    }
  };

const toProduct = ({ payload: product }) => ({ ...product, id: uuid() });
