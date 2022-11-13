import { factory } from './factory';

describe('# @lib/create-config::queues::factory', () => {
  beforeEach(() => {
    delete process.env.QUEUES_CATALOG_ITEMS;
  });

  describe('when evironment variables is set', () => {
    it('should return config', () => {
      process.env['QUEUES_CATALOG_ITEMS'] = 'catalogItemsQueue';
      expect(factory()).toStrictEqual({
        catalogItems: 'catalogItemsQueue',
      });
    });
  });
});
