import { createCreateProduct } from './create-create-product';

describe('# services:createCreateProduct', () => {
  describe('when filter not passed', () => {
    it('should return id of new product', async () => {
      const repo = { createProduct: async () => {} };
      const createProduct = createCreateProduct({ repo });
      const body = {
        title: 'title',
        description: 'description',
        price: 10,
        count: 1,
      };
      const result = await createProduct({ body });
      expect(result).toStrictEqual({
        statusCode: 201,
        body: { id: expect.any(String) },
      });
    });
  });
});
