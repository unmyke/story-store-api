import { DB_AUTH_METHOD } from '@lib/create-config';
import { ErrorTypes } from '@lib/errors';

import { createDb } from './create-db';

describe('# @lib/create-db', () => {
  const auth = DB_AUTH_METHOD.IAM;
  const host = 'host';
  const port = 0;
  const database = 'database';
  const user = 'user';
  const region = 'region';
  const dbConfig = { auth, host, port, database, user, region };

  it('should return db abstraction', () => {
    const db = createDb(dbConfig);
    expect(db).not.toBeNull();
    expect(db).toStrictEqual({
      query: expect.any(Function),
      transaction: expect.any(Function),
    });
  });

  describe('## query', () => {
    describe('when passed fake config', () => {
      it('should throw connection error', async () => {
        const { query } = createDb(dbConfig);
        const error = await query('SQL', ['value']).catch((error) => error);
        expect(error).toMatchObject({
          message: 'An error occured while try to connect to database',
          type: ErrorTypes.DATA_ACCESS.name,
          code: ErrorTypes.DATA_ACCESS.codes.CONNECTION,
        });
      });
    });
  });

  describe('## transaction', () => {
    describe('when passed fake config', () => {
      it('should throw connection error', async () => {
        const { transaction } = createDb(dbConfig);
        const error = await transaction(async (atomicQueryRunner) => {
          await atomicQueryRunner('SQL', ['value']);
        }).catch((error) => error);
        expect(error).toMatchObject({
          message: 'An error occured while try to connect to database',
          type: ErrorTypes.DATA_ACCESS.name,
          code: ErrorTypes.DATA_ACCESS.codes.CONNECTION,
        });
      });
    });
  });
});
