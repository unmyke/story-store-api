import { v4 as uuid } from 'uuid';
import { Errors } from '@lib/errors';

export const createCatalogBatchProcess =
  ({ config: { topics }, repo, notifier }) =>
  async (events) => {
    const products = events.map(toProduct);
    const productIds = products.map(({ id }) => id);
    try {
      await repo.createProducts(products);

      await notifier.send(topics.createProduct, {
        subject: 'New products created',
        message: `New products with ids "${productIds.join(', ')}" created."`,
      });

      return { productIds };
    } catch (error) {
      throw new Errors.Domain(
        'An error occured when try to create batch of products',
        error,
      );
    }
  };

const toProduct = ({ payload: product }) => ({ ...product, id: uuid() });
