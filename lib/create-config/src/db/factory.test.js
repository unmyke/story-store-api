import { factory } from './factory';

describe('# @lib/create-config::db::factory', () => {
  beforeEach(() => {
    delete process.env.DB_AUTH;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_NAME;
    delete process.env.DB_USER;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_REGION;
  });

  describe('when evironment variables is not set', () => {
    it('should throw', () => {
      const expectedErrorMessage =
        'Database auth method "undefined" is invalid. "DB_AUTH" environment variable must be one this values: "simple, iam"';
      expect(() => factory()).toThrow(expectedErrorMessage);
    });
  });

  describe('when evironment variables is set', () => {
    describe('when simple auth method is set', () => {
      it('should return config', () => {
        process.env['DB_AUTH'] = 'simple';
        process.env['DB_HOST'] = 'host';
        process.env['DB_PORT'] = '10';
        process.env['DB_NAME'] = 'database';
        process.env['DB_USER'] = 'user';
        process.env['DB_PASSWORD'] = 'password';
        process.env['DB_REGION'] = 'aws-region-1';
        expect(factory()).toStrictEqual({
          auth: 'simple',
          host: 'host',
          port: 10,
          database: 'database',
          user: 'user',
          password: 'password',
        });
      });
    });

    describe('when IAM auth method is set', () => {
      it('should return config', () => {
        process.env['DB_AUTH'] = 'iam';
        process.env['DB_HOST'] = 'host';
        process.env['DB_PORT'] = '10';
        process.env['DB_NAME'] = 'database';
        process.env['DB_USER'] = 'user';
        process.env['DB_PASSWORD'] = 'password';
        process.env['DB_REGION'] = 'aws-region-1';
        expect(factory()).toStrictEqual({
          auth: 'iam',
          host: 'host',
          port: 10,
          database: 'database',
          user: 'user',
          region: 'aws-region-1',
        });
      });
    });
  });
});
