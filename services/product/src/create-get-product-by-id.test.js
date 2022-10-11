import { errors } from '@lib/errors';
import { data, db } from '@lib/mock-db';

import { createGetProductById } from './create-get-product-by-id';
import { createQuery } from './create-query';

describe('# services:createGetProductById', () => {
  describe('when passed id of existing product', () => {
    it('should return the product', async () => {
      expect.assertions(data.products.length);
      const query = createQuery({ db });
      const getProduct = createGetProductById({ query });
      for (const product of data.products) {
        const result = await getProduct({ id: product.id });
        expect(result).toMatchObject(product);
      }
    });
  });

  describe('when passed id of non existent product', () => {
    it('should throw "not found" error', async () => {
      expect.assertions(2);
      const query = createQuery({ db });
      const getProduct = createGetProductById({ query });
      const error = await getProduct({ id: 'non-existent-id' }).catch(
        (error) => error,
      );
      await expect(error).toBeInstanceOf(errors.NotFound);
      await expect(error.message).toBe(
        'Product with id=non-existent-id not found',
      );
    });
  });
});
