/* eslint-disable jest/max-expects */
import { createQueryRunner } from './create-query-runner';

describe('# @lib/create-db::createQueryRunner', () => {
  it('should return "query" method', () => {
    const createClient = () => {};
    const queryRunner = createQueryRunner(createClient);
    expect(queryRunner).toStrictEqual({
      query: expect.any(Function),
      transaction: expect.any(Function),
    });
  });

  describe('## query', () => {
    it('should respect client contract', async () => {
      const connect = jest.fn(async () => {});
      const disconnect = jest.fn(async () => {});
      const atomicQuery = jest.fn(async (...args) => args);
      const createClient = () => ({
        atomicQuery,
        connect,
        disconnect,
      });

      const { query } = createQueryRunner(createClient);
      const sqlQuery = 'SQL QUERY';
      const values = ['val1', 'val2', 'val3'];
      const result = await query(sqlQuery, values);
      expect(connect).toHaveBeenCalledTimes(1);
      expect(atomicQuery).toHaveBeenCalledTimes(1);
      expect(atomicQuery).toHaveBeenLastCalledWith(sqlQuery, values);
      expect(result).toStrictEqual([sqlQuery, values]);
      expect(disconnect).toHaveBeenCalledTimes(1);
    });

    describe('when client.connect fails', () => {
      it('should throw error', async () => {
        const connectionError = new Error('connection error');
        const connect = async () => {
          throw connectionError;
        };
        const disconnect = jest.fn(async () => {});
        const atomicQuery = jest.fn(async (...args) => args);
        const createClient = () => ({
          connect,
          disconnect,
          atomicQuery,
        });

        const { query } = createQueryRunner(createClient);
        const error = await query('SQL QUERY').catch((error) => error);
        expect(error).toBe(connectionError);
        expect(atomicQuery).not.toHaveBeenCalled();
        expect(disconnect).not.toHaveBeenCalled();
      });
    });

    describe('when client.disconnect fails', () => {
      it('should throw error', async () => {
        const connect = jest.fn(async () => {});
        const disconnectionError = new Error('disconnection error');
        const disconnect = async () => {
          throw disconnectionError;
        };
        const atomicQuery = jest.fn(async (...args) => args);
        const createClient = () => ({
          connect,
          disconnect,
          atomicQuery,
        });

        const { query } = createQueryRunner(createClient);
        const error = await query('SQL QUERY').catch((error) => error);
        expect(error).toBe(disconnectionError);
        expect(connect).toHaveBeenCalledTimes(1);
        expect(atomicQuery).toHaveBeenCalledTimes(1);
      });
    });

    describe('when client.query fails', () => {
      it('should throw error', async () => {
        const connect = jest.fn(async () => {});
        const disconnect = jest.fn(async () => {});
        const atomicQueryError = new Error('query error');
        const atomicQuery = async () => {
          throw atomicQueryError;
        };
        const createClient = () => ({
          connect,
          disconnect,
          atomicQuery,
        });

        const { query } = createQueryRunner(createClient);
        const error = await query('SQL QUERY', [
          'value1',
          'value3',
          'value3',
        ]).catch((error) => error);
        expect(error).toMatchObject(atomicQueryError);
        expect(connect).toHaveBeenCalledTimes(1);
        expect(disconnect).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('## transaction', () => {
    it('should respect client transaction contract', async () => {
      const connect = jest.fn(async () => {});
      const disconnect = jest.fn(async () => {});
      const atomicQuery = jest.fn(async (...args) => args);
      const begin = jest.fn(() => {});
      const commit = jest.fn(() => {});
      const rollback = jest.fn(() => {});
      const createClient = () => ({
        connect,
        disconnect,
        atomicQuery,
        transaction: { begin, commit, rollback },
      });

      const { transaction } = createQueryRunner(createClient);
      const sqlQuery1 = 'SQL QUERY1';
      const values1 = ['query1-val1', 'query1-val2', 'query1-val3'];
      const sqlQuery2 = 'SQL QUERY2';
      const values2 = ['query2-val1', 'query2-val2', 'query2-val3'];
      const transactionCallback = async (query) => {
        await query(sqlQuery1, values1);
        return query(sqlQuery2, values2);
      };
      const result = await transaction(transactionCallback);
      expect(connect).toHaveBeenCalledTimes(1);
      expect(atomicQuery).toHaveBeenCalledTimes(2);
      expect(atomicQuery).toHaveBeenNthCalledWith(1, sqlQuery1, values1);
      expect(atomicQuery).toHaveBeenNthCalledWith(2, sqlQuery2, values2);
      expect(result).toStrictEqual([sqlQuery2, values2]);
      expect(begin).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledTimes(1);
      expect(rollback).not.toHaveBeenCalled();
      expect(disconnect).toHaveBeenCalledTimes(1);
    });

    describe('when pg.Client.connect fails', () => {
      it('should throw Connection error', async () => {
        const connectionError = new Error('connection error');
        const connect = async () => {
          throw connectionError;
        };
        const disconnect = jest.fn(async () => {});
        const atomicQuery = jest.fn(async (...args) => args);
        const begin = jest.fn(() => {});
        const commit = jest.fn(() => {});
        const rollback = jest.fn(() => {});
        const createClient = () => ({
          connect,
          disconnect,
          atomicQuery,
          transaction: { begin, commit, rollback },
        });

        const { transaction } = createQueryRunner(createClient);
        const error = await transaction(async () => {}).catch((error) => error);
        expect(error).toBe(connectionError);
        expect(atomicQuery).not.toHaveBeenCalled();
        expect(disconnect).not.toHaveBeenCalled();
        expect(begin).not.toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
        expect(rollback).not.toHaveBeenCalled();
      });
    });

    describe('when client.disconnect fails', () => {
      it('should throw Connection error', async () => {
        const connect = jest.fn(async () => {});
        const disconnectionError = new Error('disconnection error');
        const disconnect = async () => {
          throw disconnectionError;
        };
        const atomicQuery = jest.fn(async (...args) => args);
        const begin = jest.fn(() => {});
        const commit = jest.fn(() => {});
        const rollback = jest.fn(() => {});
        const createClient = () => ({
          connect,
          disconnect,
          atomicQuery,
          transaction: { begin, commit, rollback },
        });

        const { transaction } = createQueryRunner(createClient);
        const error = await transaction(async (atomicQuery) => {
          await atomicQuery();
        }).catch((error) => error);
        expect(error).toMatchObject(disconnectionError);
        expect(connect).toHaveBeenCalledTimes(1);
        expect(begin).toHaveBeenCalledTimes(1);
        expect(atomicQuery).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledTimes(1);
        expect(rollback).not.toHaveBeenCalled();
      });
    });

    describe('when Client.atomicQuery fails', () => {
      it('should throw transaction callback failed', async () => {
        const connect = jest.fn(async () => {});
        const atomicQueryError = new Error('atomicQuery error');
        const disconnect = jest.fn(async (...args) => args);
        const atomicQuery = async () => {
          throw atomicQueryError;
        };
        const begin = jest.fn(() => {});
        const commit = jest.fn(() => {});
        const rollback = jest.fn(() => {});
        const createClient = () => ({
          connect,
          disconnect,
          atomicQuery,
          transaction: { begin, commit, rollback },
        });

        const { transaction } = createQueryRunner(createClient);
        const error = await transaction(async (query) => {
          await query('SQL QUERY', ['value1', 'value3', 'value3']);
        }).catch((error) => error);
        expect(error).toBe(atomicQueryError);
        expect(connect).toHaveBeenCalledTimes(1);
        expect(begin).toHaveBeenCalledTimes(1);
        expect(commit).not.toHaveBeenCalled();
        expect(rollback).toHaveBeenCalledTimes(1);
        expect(disconnect).toHaveBeenCalledTimes(1);
      });
    });
  });
});
