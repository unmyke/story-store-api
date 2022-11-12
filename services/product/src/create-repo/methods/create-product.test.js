import { createProduct as createProductFactory } from './create-product';

const removeExtraWithespaces = (str) => str.replace(/\s+/g, ' ').trim();

describe('# @services/prodcut::createRepo::createProduct', () => {
  it('should respect db.query contract', async () => {
    const query = jest.fn();
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
    await createProduct(productToCreate);
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

  describe('when db.transaction resolves', () => {
    it('should resolves', async () => {
      const query = jest.fn();
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
      await expect(createProduct(productToCreate)).resolves.toBeUndefined();
    });
  });

  describe('when db.transaction rejects', () => {
    it('should rejects', async () => {
      const queryError = new Error('query error');
      const query = jest.fn(async () => {
        throw queryError;
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
      await expect(createProduct(productToCreate)).rejects.toThrow({
        message: 'query error',
        cause: queryError,
      });
    });
  });
});
