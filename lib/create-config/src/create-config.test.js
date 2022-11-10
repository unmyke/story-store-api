import { Errors } from '@lib/errors';

import { ConfigSections } from './constants';
import { createConfig } from './create-config';

describe('# @lib/create-config', () => {
  describe('when config section not passed', () => {
    it('should return empty config', () => {
      expect(createConfig()).toStrictEqual({});
    });
  });

  describe('when config section in not valid', () => {
    it('should throw', () => {
      expect(() => createConfig('')).toThrow({
        message: 'Config section "" in not exists',
      });
    });
  });

  describe('when config section passed', () => {
    describe('when passed "db" section', () => {
      describe('when evironment variables is not set', () => {
        it('should throw', () => {
          expect(() => createConfig(ConfigSections.DB)).toThrow(Errors.Config);
        });
      });

      describe('when evironment variables is set', () => {
        beforeEach(() => {
          delete process.env.DB_AUTH;
          delete process.env.DB_HOST;
          delete process.env.DB_PORT;
          delete process.env.DB_NAME;
          delete process.env.DB_USER;
          delete process.env.DB_PASSWORD;
          delete process.env.DB_REGION;
        });

        describe('when evironment variables is invalid', () => {
          it('should throw', () => {
            process.env['DB_AUTH'] = 'simple';
            expect(() => createConfig(ConfigSections.DB)).toThrow({
              message: 'An error accure while validating db configuration',
            });
          });
        });

        describe('when evironment variables is valid', () => {
          describe('when simple auth method is set', () => {
            it('should return config', () => {
              process.env['DB_AUTH'] = 'simple';
              process.env['DB_HOST'] = 'host';
              process.env['DB_PORT'] = '10';
              process.env['DB_NAME'] = 'database';
              process.env['DB_USER'] = 'user';
              process.env['DB_PASSWORD'] = 'password';
              process.env['DB_REGION'] = 'aws-region-1';
              expect(createConfig(ConfigSections.DB)).toStrictEqual({
                db: {
                  auth: 'simple',
                  host: 'host',
                  port: 10,
                  database: 'database',
                  user: 'user',
                  password: 'password',
                },
              });
            });
          });

          describe('when DB IAM auth method is set', () => {
            it('should return config', () => {
              process.env['DB_AUTH'] = 'iam';
              process.env['DB_HOST'] = 'host';
              process.env['DB_PORT'] = '10';
              process.env['DB_NAME'] = 'database';
              process.env['DB_USER'] = 'user';
              process.env['DB_PASSWORD'] = 'password';
              process.env['DB_REGION'] = 'aws-region-1';
              expect(createConfig(ConfigSections.DB)).toStrictEqual({
                db: {
                  auth: 'iam',
                  host: 'host',
                  port: 10,
                  database: 'database',
                  user: 'user',
                  region: 'aws-region-1',
                },
              });
            });
          });
        });
      });
    });
  });
});
