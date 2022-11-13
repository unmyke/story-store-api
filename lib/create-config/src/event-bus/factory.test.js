import { factory } from './factory';

describe('# @lib/create-config::event-bus::factory', () => {
  beforeEach(() => {
    delete process.env.EVENT_BUS_REGION;
    delete process.env.EVENT_BUS_BASE_URL;
  });

  describe('when evironment variables is set', () => {
    it('should return config', () => {
      process.env['EVENT_BUS_REGION'] = 'region';
      process.env['EVENT_BUS_BASE_URL'] = 'https://base.url';
      expect(factory()).toStrictEqual({
        region: 'region',
        baseUrl: 'https://base.url',
      });
    });
  });
});
