import { ErrorTypes } from '@lib/errors';
import { products } from '@lib/mock-data';

import { getProduct as getProductFactory } from './get-product';

const removeExtraWithespaces = (str) => str.replace(/\s+/g, ' ').trim();

describe('# @services/prodcut::createRepo::getProduct', () => {
  describe('### respect db.query contract', () => {
    it('should call db.query method', async () => {
      const noop = () => {};
      const query = jest.fn(async () => ({ rows: [] }));
      const db = { query };
      const getProduct = getProductFactory(db);
      await getProduct('id').then(noop, noop);
      expect(query).toHaveBeenCalledTimes(1);
      const [recievedSqlQuery, recievedValues] = query.mock.calls[0];
      const expectedSqlQuery =
        'SELECT p.id as id, p.title as title, p.description as description, p.price as price, s.count as count FROM products p JOIN stocks s ON p.id = s.product_id WHERE p.id=$1';
      expect(removeExtraWithespaces(recievedSqlQuery)).toBe(expectedSqlQuery);
      expect(recievedValues).toStrictEqual(['id']);
    });
  });

  describe('when product with passed productId exists', () => {
    it('should return product', async () => {
      const [expectedProduct] = products;
      const { id } = expectedProduct;
      const query = jest.fn(async () => ({ rows: [expectedProduct] }));
      const db = { query };
      const getProduct = getProductFactory(db);
      const product = await getProduct(id);
      expect(product).toStrictEqual(products[0]);
    });
  });

  describe('when product with passed productId is not exist', () => {
    it('should throw NotFound error', async () => {
      const query = jest.fn(async () => ({ rows: [] }));
      const db = { query };
      const getProduct = getProductFactory(db);
      const error = await getProduct('id').catch((err) => err);
      expect(error).toMatchObject({
        message: 'Product with id "id" not found',
        type: ErrorTypes.DATA_ACCESS.name,
        code: ErrorTypes.DATA_ACCESS.codes.NOT_FOUND,
      });
    });
  });
});
