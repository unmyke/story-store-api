import { factory } from './factory';

describe('# @lib/create-config::notifier::factory', () => {
  beforeEach(() => {
    delete process.env.NOTIFIER_REGION;
    delete process.env.NOTIFIER_BASE_ARN;
    delete process.env.NOTIFIER_CREATE_PRODUCT_TOPIC;
  });

  describe('when evironment variables is set', () => {
    it('should return config', () => {
      process.env['NOTIFIER_REGION'] = 'region';
      process.env['NOTIFIER_BASE_ARN'] = 'arn:aws:sns:base';
      process.env['NOTIFIER_CREATE_PRODUCT_TOPIC'] = 'createProductTopic';
      expect(factory()).toStrictEqual({
        region: 'region',
        baseArn: 'arn:aws:sns:base',
        topics: { createProduct: 'createProductTopic' },
      });
    });
  });
});
