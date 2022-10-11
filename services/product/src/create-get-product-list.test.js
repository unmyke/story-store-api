import { data, db } from '@lib/mock-db';

import { createGetProductList } from './create-get-product-list';
import { createQuery } from './create-query';

describe('# services:createGetProductList', () => {
  describe('when filter not passed', () => {
    it('should return the list of all products', async () => {
      const query = createQuery({ db });
      const getProductList = createGetProductList({ query });
      const result = await getProductList({});
      expect(result).toMatchObject(data.products);
    });
  });

  describe('when empty filter passed', () => {
    it('should return the list of all products', async () => {
      expect.assertions(1);
      const query = createQuery({ db });
      const getProductList = createGetProductList({ query });
      const result = await getProductList({ filter: {} });
      expect(result).toMatchObject(data.products);
    });
  });

  describe('when passed filter:', () => {
    describe('- "available"', () => {
      it('should return the list of available products', async () => {
        expect.assertions(1);
        const query = createQuery({ db });
        const getProductList = createGetProductList({ query });
        const result = await getProductList({ filter: { available: '' } });
        expect(result).toMatchObject(
          data.products.filter(({ count }) => count > 0),
        );
      });
    });
  });
});
