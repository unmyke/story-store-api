import { types } from '@lib/errors';

import { createClientFactory } from './create-client-factory';

describe('# @lib/create-db::createClientFactory', () => {
  describe('when passed fake config', () => {
    const host = 'host';
    const port = 0;
    const database = 'database';
    const user = 'user';
    const query_timeout = 10;
    const dbConfig = { host, port, database, user, query_timeout };

    const createClient = createClientFactory(dbConfig);

    it('should return client abstraction factory', () => {
      expect(createClient).not.toBeNull();
      expect(createClient).toStrictEqual(expect.any(Function));
    });

    describe('## client factory', () => {
      it('should return client abstraction', () => {
        const client = createClient();
        expect(client).toStrictEqual({
          connect: expect.any(Function),
          disconnect: expect.any(Function),
          atomicQuery: expect.any(Function),
          transaction: {
            begin: expect.any(Function),
            commit: expect.any(Function),
            rollback: expect.any(Function),
          },
        });
      });

      describe('## connect', () => {
        it('should throw connection error', async () => {
          const { connect } = createClient();
          const error = await connect().catch((error) => error);
          expect(error).toMatchObject({
            message: 'An error occured while try to connect to database',
            type: types.DATA_ACCESS.name,
            code: types.DATA_ACCESS.codes.CONNECTION,
          });
        });
      });

      describe('## disconnect', () => {
        it('should not throw', async () => {
          const { disconnect } = createClient();
          expect(() => disconnect()).not.toThrow();
        });
      });

      describe('## atomicQuery', () => {
        it('should throw query error', async () => {
          const { atomicQuery } = createClient();
          const error = await atomicQuery('SQL', ['value']).catch(
            (error) => error,
          );
          expect(error).toMatchObject({
            message: 'Unable to process query "SQL" with values "value"',
            type: types.DATA_ACCESS.name,
            code: types.DATA_ACCESS.codes.QUERY,
          });
        });
      });

      describe('## transaction', () => {
        describe('### begin', () => {
          it('should throw error', async () => {
            const { transaction } = createClient();
            const error = await transaction.begin().catch((error) => error);
            expect(error).toMatchObject({
              message: 'Query read timeout',
            });
          });
        });

        describe('### commit', () => {
          it('should throw error', async () => {
            const { transaction } = createClient();
            const error = await transaction.commit().catch((error) => error);
            expect(error).toMatchObject({
              message: 'Query read timeout',
            });
          });
        });

        describe('### rollback', () => {
          it('should throw error', async () => {
            const { transaction } = createClient();
            const error = await transaction.rollback().catch((error) => error);
            expect(error).toMatchObject({
              message: 'Query read timeout',
            });
          });
        });
      });
    });
  });
});
