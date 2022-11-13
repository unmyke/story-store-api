import { factory } from './factory';

describe('# @lib/create-config::upload-store::factory', () => {
  beforeEach(() => {
    delete process.env.UPLOAD_STORE_REGION;
    delete process.env.UPLOAD_STORE_BUCKET;
    delete process.env.UPLOAD_STORE_DIRS_UPLOADED;
    delete process.env.UPLOAD_STORE_DIRS_PARSED;
  });

  describe('when evironment variables is set', () => {
    it('should return config', () => {
      process.env['UPLOAD_STORE_REGION'] = 'region';
      process.env['UPLOAD_STORE_BUCKET'] = 'bucket';
      process.env['UPLOAD_STORE_DIRS_UPLOADED'] = 'uploaded';
      process.env['UPLOAD_STORE_DIRS_PARSED'] = 'parsed';
      expect(factory()).toStrictEqual({
        region: 'region',
        bucket: 'bucket',
        dirs: { uploaded: 'uploaded', parsed: 'parsed' },
      });
    });
  });
});
