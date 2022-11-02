import { errors } from '@lib/errors';

import { toNumber } from '../mappers';

import { AUTH_METHOD } from './constants';

export const createDbConfig = () => {
  const auth = process.env['DB_AUTH'];
  const host = process.env['DB_HOST'];
  const port = toNumber(process.env['DB_PORT']);
  const database = process.env['DB_NAME'];
  const user = process.env['DB_USER'];
  const password = process.env['DB_PASSWORD'];
  const region = process.env['DB_REGION'];
  const common = { auth, host, port, database, user };

  if (auth === AUTH_METHOD.SIMPLE) return { ...common, password };
  if (auth === AUTH_METHOD.IAM) return { ...common, region };

  throw new errors.Config(
    `Database auth method "${auth}" is invalid. "DB_AUTH" environment variable must be one this values: "${Object.values(
      AUTH_METHOD,
    ).join(', ')}"`,
  );
};