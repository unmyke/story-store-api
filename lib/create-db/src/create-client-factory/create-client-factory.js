import { Client } from 'pg';
import { Errors } from '@lib/errors';

import { createConnectionHooks } from './create-connection-hooks';

export const createClientFactory = (config) => () => {
  const client = new Client(config);
  const { connect, disconnect } = createConnectionHooks(client);
  const atomicQuery = createAtomicQuery(client);
  const begin = () => client.query('BEGIN');
  const commit = () => client.query('COMMIT');
  const rollback = () => client.query('ROLLBACK');
  const transaction = { begin, commit, rollback };

  return {
    connect,
    disconnect,
    atomicQuery,
    transaction,
  };
};

const createAtomicQuery = (client) => async (query, values) =>
  client.query(query, values).catch((error) => {
    throw new Errors.Query(
      `Unable to process query "${query}" with values "${values}"`,
      error,
    );
  });
