import { RDS } from 'aws-sdk';
import { DB_AUTH_METHOD } from '@lib/create-config';
import { errors } from '@lib/errors';

export const createDbConfig = ({ auth, region, ...common }) => {
  const pgConfig = { ...common, keepAlive: true };
  if (auth === DB_AUTH_METHOD.SIMPLE) return pgConfig;
  if (auth === DB_AUTH_METHOD.IAM)
    return { ...pgConfig, password: getIamToken({ ...common, region }) };

  throw new errors.Config(
    `Database auth method "${auth}" is invalid. "config.auth" value must be one this values: "${Object.values(
      DB_AUTH_METHOD,
    ).join(', ')}"`,
  );
};

const getIamToken = ({ host, port, user, region }) => {
  const signer = new RDS.Signer({
    hostname: host,
    port,
    username: user,
    region,
  });
  return signer.getAuthToken({ username: user });
};
