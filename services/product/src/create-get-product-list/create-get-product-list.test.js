import { products } from '@lib/mock-data';

import { createGetProductList } from './create-get-product-list';

describe('# services:createGetProductList', () => {
  describe('when filter not passed', () => {
    it('should return the list of all products', async () => {
      const getProducts = async () => products;
      const repo = { getProducts };
      const getProductList = createGetProductList({ repo });
      const result = await getProductList({});
      expect(result).toMatchObject({
        statusCode: 200,
        body: products,
      });
    });
  });

  describe('when empty filter passed', () => {
    it('should return the list of all products', async () => {
      const getProducts = async () => products;
      const repo = { getProducts };
      const getProductList = createGetProductList({ repo });
      const result = await getProductList({ filter: {} });
      expect(result).toMatchObject({
        statusCode: 200,
        body: products,
      });
    });
  });

  describe('when passed query:', () => {
    describe('- "available" is empty string', () => {
      it('should return the list of available products', async () => {
        const expectedProducts = products.filter(({ count }) => count > 0);
        const getProducts = jest.fn(async () => expectedProducts);
        const repo = { getProducts };
        const getProductList = createGetProductList({ repo });
        const result = await getProductList({ query: { available: '' } });
        expect(result).toMatchObject({
          statusCode: 200,
          body: expectedProducts,
        });
        expect(getProducts).toHaveBeenCalledTimes(1);
        expect(getProducts).toHaveBeenLastCalledWith({
          filter: { available: true },
        });
      });
    });

    describe('- "available" is string "true"', () => {
      it('should return the list of available products', async () => {
        const expectedProducts = products.filter(({ count }) => count > 0);
        const getProducts = jest.fn(async () => expectedProducts);
        const repo = { getProducts };
        const getProductList = createGetProductList({ repo });
        const result = await getProductList({ query: { available: '' } });
        expect(result).toMatchObject({
          statusCode: 200,
          body: expectedProducts,
        });
        expect(getProducts).toHaveBeenCalledTimes(1);
        expect(getProducts).toHaveBeenLastCalledWith({
          filter: { available: true },
        });
      });
    });

    describe('- "available" is string "false"', () => {
      it('should return the list of available products', async () => {
        const expectedProducts = products.filter(({ count }) => count === 0);
        const getProducts = jest.fn(async () => expectedProducts);
        const repo = { getProducts };
        const getProductList = createGetProductList({ repo });
        const result = await getProductList({ query: { available: 'false' } });
        expect(result).toMatchObject({
          statusCode: 200,
          body: expectedProducts,
        });
        expect(getProducts).toHaveBeenCalledTimes(1);
        expect(getProducts).toHaveBeenLastCalledWith({
          filter: { available: false },
        });
      });
    });
  });
});
