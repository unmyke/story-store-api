import { errors } from '@lib/errors';

import { createProduct as createProductFactory } from './create-product';

const removeExtraWithespaces = (str) => str.replace(/\s+/g, ' ').trim();

describe('# @services/prodcut::createRepo::createProduct', () => {
  describe('### respect db.query contract', () => {
    describe('when create product successed', () => {
      it('should call db.query method with all SQL trans', async () => {
        const noop = () => {};
        const query = jest.fn(async () => {});
        const transaction = async (queryCallback) => {
          await queryCallback(query);
        };
        const db = { transaction };
        const createProduct = createProductFactory(db);
        const productToCreate = {
          id: 'id',
          title: 'product',
          description: 'product description',
          price: 100,
          count: 20,
        };
        await createProduct(productToCreate).then(noop, noop);
        expect(query).toHaveBeenCalledTimes(2);
        const [
          [recievedSqlInsertToProductQuery, recievedProductValues],
          [recievedSqlInsertToStockQuery, recievedStockValues],
        ] = query.mock.calls;

        const expectedSqlInsertToProductQuery =
          'INSERT INTO products(id, title, description, price) VALUES ($1, $2, $3, $4)';
        expect(removeExtraWithespaces(recievedSqlInsertToProductQuery)).toBe(
          expectedSqlInsertToProductQuery,
        );
        expect(recievedProductValues).toStrictEqual([
          productToCreate.id,
          productToCreate.title,
          productToCreate.description,
          productToCreate.price,
        ]);

        const expectedSqlInsertToStockQuery =
          'INSERT INTO stocks(product_id, count) VALUES ($1, $2)';
        expect(removeExtraWithespaces(recievedSqlInsertToStockQuery)).toBe(
          expectedSqlInsertToStockQuery,
        );
        expect(recievedStockValues).toStrictEqual([
          productToCreate.id,
          productToCreate.count,
        ]);
      });
    });

    describe('when create product failed', () => {
      it('should throw query error', async () => {
        const noop = () => {};
        const query = jest.fn(async () => {
          throw new errors.Query('query error');
        });
        const transaction = async (queryCallback) => {
          await queryCallback(query);
        };
        const db = { transaction };
        const createProduct = createProductFactory(db);
        const productToCreate = {
          id: 'id',
          title: 'product',
          description: 'product description',
          price: 100,
          count: 20,
        };
        await createProduct(productToCreate).then(noop, noop);
        expect(query).toHaveBeenCalledTimes(1);
        const [[recievedSqlInsertToProductQuery, recievedProductValues]] =
          query.mock.calls;

        const expectedSqlInsertToProductQuery =
          'INSERT INTO products(id, title, description, price) VALUES ($1, $2, $3, $4)';
        expect(removeExtraWithespaces(recievedSqlInsertToProductQuery)).toBe(
          expectedSqlInsertToProductQuery,
        );
        expect(recievedProductValues).toStrictEqual([
          productToCreate.id,
          productToCreate.title,
          productToCreate.description,
          productToCreate.price,
        ]);
      });
    });
  });
});
