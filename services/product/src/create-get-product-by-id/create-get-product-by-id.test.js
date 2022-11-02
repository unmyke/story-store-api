import { errors } from '@lib/errors';
import { products } from '@lib/mock-data';

import { createGetProductById } from './create-get-product-by-id';

describe('# services:createGetProductById', () => {
  describe('when passed id of existing product', () => {
    it('should return the product', async () => {
      expect.assertions(products.length);
      const getProduct = async (id) =>
        products.find(({ id: currnetId }) => currnetId === id);
      const repo = { getProduct };
      const getProductById = createGetProductById({ repo });
      for (const product of products) {
        const result = await getProductById({ params: { id: product.id } });
        expect(result).toMatchObject({
          statusCode: 200,
          body: product,
        });
      }
    });
  });

  describe('when passed id of non existent product', () => {
    it('should throw "not found" error', async () => {
      expect.assertions(2);
      const getProduct = async (id) => {
        throw new errors.NotFound(`Product with id "${id}" not found`);
      };
      const repo = { getProduct };
      const getProductById = createGetProductById({ repo });
      const error = await getProductById({
        params: { id: 'non-existent-id' },
      }).catch((error) => error);
      await expect(error).toBeInstanceOf(errors.NotFound);
      await expect(error.message).toBe(
        'Product with id "non-existent-id" not found',
      );
    });
  });
});
