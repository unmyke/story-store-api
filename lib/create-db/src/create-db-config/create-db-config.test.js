import { Errors } from '@lib/errors';

import { createDbConfig } from './create-db-config';

describe('# @lib/create-db::createDbConfig', () => {
  describe('when passed config with simple authentication', () => {
    it('should return pg.ClientConfig', () => {
      const auth = 'simple';
      const host = 'host';
      const port = 0;
      const database = 'database';
      const user = 'user';
      const password = 'password';
      const dbConfig = { auth, host, port, database, user, password };
      const pgClientConfig = createDbConfig(dbConfig);
      expect(pgClientConfig).toStrictEqual({
        host,
        port,
        database,
        user,
        password,
        keepAlive: true,
      });
    });
  });

  describe('when passed config with AWS IAM authentication', () => {
    it('should return pg.ClientConfig with token as password', () => {
      const auth = 'iam';
      const host = 'host';
      const port = 0;
      const database = 'database';
      const user = 'user';
      const region = 'region';
      const dbConfig = { auth, host, port, database, user, region };
      const pgClientConfig = createDbConfig(dbConfig);
      expect(pgClientConfig).toStrictEqual({
        host,
        port,
        database,
        user,
        password: expect.any(String),
        keepAlive: true,
      });
    });
  });

  describe('when passed config without authentication', () => {
    it('should throw', () => {
      const host = 'host';
      const port = 0;
      const database = 'database';
      const user = 'user';
      const password = 'password';
      const region = 'region';
      const dbConfig = { host, port, database, user, password, region };
      expect(() => createDbConfig(dbConfig)).toThrow(Errors.Config);
    });
  });
});
