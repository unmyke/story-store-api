import { createProducts as createProductsFactory } from './create-products';

const removeExtraWithespaces = (str) => str.replace(/\s+/g, ' ').trim();
const productsToCreate = [
  {
    id: 'id1',
    title: 'product1',
    description: 'product description1',
    price: 1,
    count: 1,
  },
  {
    id: 'id2',
    title: 'product2',
    description: 'product description2',
    price: 2,
    count: 2,
  },
  {
    id: 'id3',
    title: 'product3',
    description: 'product description3',
    price: 3,
    count: 3,
  },
];

describe('# @services/prodcut::createRepo::createProducts', () => {
  it('should respect db.query contract', async () => {
    const query = jest.fn();
    const transaction = async (queryCallback) => {
      await queryCallback(query);
    };
    const db = { transaction };
    const createProducts = createProductsFactory(db);
    await createProducts(productsToCreate);
    expect(query).toHaveBeenCalledTimes(2);
    const [
      [recievedSqlInsertToProductQuery, recievedProductValues],
      [recievedSqlInsertToStockQuery, recievedStockValues],
    ] = query.mock.calls;

    const expectedSqlInsertToProductQuery =
      'INSERT INTO products(id, title, description, price) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)';
    expect(removeExtraWithespaces(recievedSqlInsertToProductQuery)).toBe(
      expectedSqlInsertToProductQuery,
    );
    expect(recievedProductValues).toStrictEqual([
      productsToCreate[0].id,
      productsToCreate[0].title,
      productsToCreate[0].description,
      productsToCreate[0].price,
      productsToCreate[1].id,
      productsToCreate[1].title,
      productsToCreate[1].description,
      productsToCreate[1].price,
      productsToCreate[2].id,
      productsToCreate[2].title,
      productsToCreate[2].description,
      productsToCreate[2].price,
    ]);

    const expectedSqlInsertToStockQuery =
      'INSERT INTO stocks(product_id, count) VALUES ($1, $2), ($3, $4), ($5, $6)';
    expect(removeExtraWithespaces(recievedSqlInsertToStockQuery)).toBe(
      expectedSqlInsertToStockQuery,
    );
    expect(recievedStockValues).toStrictEqual([
      productsToCreate[0].id,
      productsToCreate[0].count,
      productsToCreate[1].id,
      productsToCreate[1].count,
      productsToCreate[2].id,
      productsToCreate[2].count,
    ]);
  });

  describe('when db.transaction resolves', () => {
    it('should resolves', async () => {
      const query = jest.fn();
      const transaction = async (queryCallback) => {
        await queryCallback(query);
      };
      const db = { transaction };
      const createProducts = createProductsFactory(db);
      await expect(createProducts(productsToCreate)).resolves.toBeUndefined();
    });
  });

  describe('when db.trasaction rejects', () => {
    it('should throw query error', async () => {
      const queryError = new Error('query error');
      const query = jest.fn(async () => {
        throw queryError;
      });
      const transaction = async (queryCallback) => {
        await queryCallback(query);
      };
      const db = { transaction };
      const createProducts = createProductsFactory(db);
      await expect(createProducts(productsToCreate)).rejects.toThrow({
        message: 'query error',
        cause: queryError,
      });
    });
  });
});
