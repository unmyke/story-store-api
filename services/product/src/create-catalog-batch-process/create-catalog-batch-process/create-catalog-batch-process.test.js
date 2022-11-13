import { ErrorTypes } from '@lib/errors';

import { createCatalogBatchProcess } from './create-catalog-batch-process';

const noop = () => {};
const products = [
  {
    title: 'title1',
    description: 'description1',
    price: 1,
    count: 1,
  },
  {
    title: 'title2',
    description: 'description2',
    price: 2,
    count: 2,
  },
  {
    title: 'title3',
    description: 'description3',
    price: 3,
    count: 3,
  },
  {
    title: 'title4',
    description: 'description4',
    price: 4,
    count: 4,
  },
  {
    title: 'title5',
    description: 'description5',
    price: 5,
    count: 5,
  },
];

describe('# @services/product::createCatalogBatchProcess', () => {
  const config = { topics: { createProduct: 'createProductTopic' } };
  it('should return catalogBatchProcess handler', () => {
    const repo = { createProducts: noop };
    const notifier = { send: noop };
    expect(createCatalogBatchProcess({ config, repo, notifier })).toStrictEqual(
      expect.any(Function),
    );
  });

  describe('## catalogBatchProcess', () => {
    describe('when passed events with product batch', () => {
      const events = products.map((product) => ({
        conext: {},
        payload: product,
      }));

      describe('when repo resolves product ids', () => {
        it('should resolves', async () => {
          const repo = { createProducts: noop };
          const notifier = { send: noop };
          const catalogBatchProcess = createCatalogBatchProcess({
            config,
            repo,
            notifier,
          });
          await expect(catalogBatchProcess(events)).resolves.toStrictEqual({
            productIds: products.map(() =>
              expect.stringMatching(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
              ),
            ),
          });
        });

        it('should call repo.createProducts', async () => {
          const createProducts = jest.fn();
          const repo = { createProducts };
          const notifier = { send: noop };
          const catalogBatchProcess = createCatalogBatchProcess({
            config,
            repo,
            notifier,
          });
          await catalogBatchProcess(events);
          expect(createProducts).toHaveBeenCalledTimes(1);
          expect(createProducts).toHaveBeenCalledWith(
            products.map((product) => ({
              ...product,
              id: expect.stringMatching(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
              ),
            })),
          );
        });

        it('should call notifier.send', async () => {
          const createProducts = noop;
          const repo = { createProducts };
          const send = jest.fn();
          const notifier = { send };
          const catalogBatchProcess = createCatalogBatchProcess({
            config,
            repo,
            notifier,
          });
          await catalogBatchProcess(events);
          expect(send).toHaveBeenCalledTimes(1);
          const expectedMessageRegexp = new RegExp(
            `New products with ids "${products
              .map(
                () =>
                  '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
              )
              .join(', ')}" created.`,
          );
          expect(send).toHaveBeenCalledWith(config.topics.createProduct, {
            subject: 'New products created',
            message: expect.stringMatching(expectedMessageRegexp),
          });
        });
      });

      describe('when repo rejects', () => {
        it('should rejests', async () => {
          const createProductsError = new Error('CreateProductsError');
          const createProducts = async () => {
            throw createProductsError;
          };
          const repo = { createProducts };
          const notifier = { send: noop };
          const catalogBatchProcess = createCatalogBatchProcess({
            config,
            repo,
            notifier,
          });
          await expect(catalogBatchProcess(events)).rejects.toThrow({
            message: 'An error occured when try to create batch of products',
            type: ErrorTypes.DOMAIN.name,
            cause: createProductsError,
          });
        });
      });
    });
  });
});
