import { products } from '@lib/mock-data';

import { getProducts as getProductsFactory } from './get-products';

const removeExtraWithespaces = (str) => str.replace(/\s+/g, ' ').trim();

describe('# @services/prodcut::createRepo::getProducts', () => {
  describe('### respect db.query contract', () => {
    describe('when filter is not passed', () => {
      it('should call db.query method', async () => {
        const noop = () => {};
        const query = jest.fn(async () => ({ rows: [] }));
        const db = { query };
        const getProducts = getProductsFactory(db);
        await getProducts({ filter: {} }).then(noop, noop);
        expect(query).toHaveBeenCalledTimes(1);
        const [recievedSqlQuery, recievedValues] = query.mock.calls[0];
        const expectedSqlQuery =
          'SELECT p.id as id, p.title as title, p.description as description, p.price as price, s.count as count FROM products p JOIN stocks s ON p.id = s.product_id';
        expect(removeExtraWithespaces(recievedSqlQuery)).toBe(expectedSqlQuery);
        expect(recievedValues).toBeUndefined();
      });
    });

    describe('when "available" filter is true', () => {
      it('should call db.query method with values', async () => {
        const noop = () => {};
        const query = jest.fn(async () => ({ rows: [] }));
        const db = { query };
        const getProducts = getProductsFactory(db);
        await getProducts({ filter: { available: true } }).then(noop, noop);
        expect(query).toHaveBeenCalledTimes(1);
        const [recievedSqlQuery, recievedValues] = query.mock.calls[0];
        const expectedSqlQuery =
          'SELECT p.id as id, p.title as title, p.description as description, p.price as price, s.count as count FROM products p JOIN stocks s ON p.id = s.product_id AND s.count > 0';
        expect(removeExtraWithespaces(recievedSqlQuery)).toBe(expectedSqlQuery);
        expect(recievedValues).toBeUndefined();
      });
    });

    describe('when "available" filter is false', () => {
      it('should call db.query method with values', async () => {
        const noop = () => {};
        const query = jest.fn(async () => ({ rows: [] }));
        const db = { query };
        const getProducts = getProductsFactory(db);
        await getProducts({ filter: { available: false } }).then(noop, noop);
        expect(query).toHaveBeenCalledTimes(1);
        const [recievedSqlQuery, recievedValues] = query.mock.calls[0];
        const expectedSqlQuery =
          'SELECT p.id as id, p.title as title, p.description as description, p.price as price, s.count as count FROM products p JOIN stocks s ON p.id = s.product_id AND s.count = 0';
        expect(removeExtraWithespaces(recievedSqlQuery)).toBe(expectedSqlQuery);
        expect(recievedValues).toBeUndefined();
      });
    });
  });

  it('should return products', async () => {
    const query = jest.fn(async () => ({ rows: products }));
    const db = { query };
    const getProducts = getProductsFactory(db);
    const recievedProducts = await getProducts({ filter: {} });
    expect(recievedProducts).toStrictEqual(products);
  });
});
