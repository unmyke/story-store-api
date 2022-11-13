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

    describe('when passed "uploadStore" section', () => {
      describe('when evironment variables is not set', () => {
        it('should throw', () => {
          expect(() => createConfig(ConfigSections.UPLOAD_STORE)).toThrow({
            message:
              'An error accure while validating uploadStore configuration',
          });
        });
      });

      describe('when evironment variables is set', () => {
        beforeEach(() => {
          delete process.env.UPLOAD_STORE_REGION;
          delete process.env.UPLOAD_STORE_BUCKET;
          delete process.env.UPLOAD_STORE_DIRS_UPLOADED;
          delete process.env.UPLOAD_STORE_DIRS_PARSED;
        });

        describe('when evironment variables is invalid', () => {
          it('should throw', () => {
            process.env['UPLOAD_STORE_REGION'] = '';
            process.env['UPLOAD_STORE_BUCKET'] = '';
            process.env['UPLOAD_STORE_DIRS_UPLOADED'] = '';
            process.env['UPLOAD_STORE_DIRS_PARSED'] = '';
            expect(() => createConfig(ConfigSections.UPLOAD_STORE)).toThrow({
              message:
                'An error accure while validating uploadStore configuration',
            });
          });
        });

        describe('when evironment variables is valid', () => {
          it('should return config', () => {
            process.env['UPLOAD_STORE_REGION'] = 'aws-region-2';
            process.env['UPLOAD_STORE_BUCKET'] = 'bucket';
            process.env['UPLOAD_STORE_DIRS_UPLOADED'] = 'uploaded';
            process.env['UPLOAD_STORE_DIRS_PARSED'] = 'parsed';
            expect(createConfig(ConfigSections.UPLOAD_STORE)).toStrictEqual({
              uploadStore: {
                region: 'aws-region-2',
                bucket: 'bucket',
                dirs: { uploaded: 'uploaded', parsed: 'parsed' },
              },
            });
          });
        });
      });
    });

    describe('when passed "eventBus" section', () => {
      describe('when evironment variables is not set', () => {
        it('should throw', () => {
          expect(() => createConfig(ConfigSections.EVENT_BUS)).toThrow({
            message: 'An error accure while validating eventBus configuration',
          });
        });
      });

      describe('when evironment variables is set', () => {
        beforeEach(() => {
          delete process.env.EVENT_BUS_REGION;
          delete process.env.EVENT_BUS_BASE_URL;
        });

        describe('when evironment variables is invalid', () => {
          it('should throw', () => {
            process.env['EVENT_BUS_REGION'] = '';
            process.env['EVENT_BUS_BASE_URL'] = '';
            expect(() => createConfig(ConfigSections.EVENT_BUS)).toThrow({
              message:
                'An error accure while validating eventBus configuration',
            });
          });
        });

        describe('when evironment variables is valid', () => {
          it('should return config', () => {
            process.env['EVENT_BUS_REGION'] = 'aws-region-1';
            process.env['EVENT_BUS_BASE_URL'] =
              'https://sqs.sm-region-1.amazonaws.com/1111';
            expect(createConfig(ConfigSections.EVENT_BUS)).toStrictEqual({
              eventBus: {
                region: 'aws-region-1',
                baseUrl: 'https://sqs.sm-region-1.amazonaws.com/1111',
              },
            });
          });
        });
      });
    });

    describe('when passed "queues" section', () => {
      describe('when evironment variables is not set', () => {
        it('should throw', () => {
          expect(() => createConfig(ConfigSections.QUEUES)).toThrow({
            message: 'An error accure while validating queues configuration',
          });
        });
      });

      describe('when evironment variables is set', () => {
        beforeEach(() => {
          delete process.env.QUEUES_CATALOG_ITEMS;
        });

        describe('when evironment variables is invalid', () => {
          it('should throw', () => {
            process.env['QUEUES_CATALOG_ITEMS'] = '';
            expect(() => createConfig(ConfigSections.QUEUES)).toThrow({
              message: 'An error accure while validating queues configuration',
            });
          });
        });

        describe('when evironment variables is valid', () => {
          it('should return config', () => {
            process.env['QUEUES_CATALOG_ITEMS'] = 'catalogItemsQueue';
            expect(createConfig(ConfigSections.QUEUES)).toStrictEqual({
              queues: {
                catalogItems: 'catalogItemsQueue',
              },
            });
          });
        });
      });
    });

    describe('when passed "notifier" section', () => {
      describe('when evironment variables is not set', () => {
        it('should throw', () => {
          expect(() => createConfig(ConfigSections.NOTIFIER)).toThrow({
            message: 'An error accure while validating notifier configuration',
          });
        });
      });

      describe('when evironment variables is set', () => {
        beforeEach(() => {
          delete process.env.NOTIFIER_REGION;
          delete process.env.NOTIFIER_BASE_ARN;
          delete process.env.NOTIFIER_CREATE_PRODUCT_TOPIC;
        });

        describe('when evironment variables is invalid', () => {
          it('should throw', () => {
            process.env['NOTIFIER_REGION'] = '';
            process.env['NOTIFIER_BASE_ARN'] = '';
            process.env['NOTIFIER_CREATE_PRODUCT_TOPIC'] = '';
            expect(() => createConfig(ConfigSections.NOTIFIER)).toThrow({
              message:
                'An error accure while validating notifier configuration',
            });
          });
        });

        describe('when evironment variables is valid', () => {
          it('should return config', () => {
            process.env['NOTIFIER_REGION'] = 'region';
            process.env['NOTIFIER_BASE_ARN'] = 'arn:aws:sns:sm-region-1:111';
            process.env['NOTIFIER_CREATE_PRODUCT_TOPIC'] = 'createProductTopic';
            expect(createConfig(ConfigSections.NOTIFIER)).toStrictEqual({
              notifier: {
                region: 'region',
                baseArn: 'arn:aws:sns:sm-region-1:111',
                topics: { createProduct: 'createProductTopic' },
              },
            });
          });
        });
      });
    });
  });
});
