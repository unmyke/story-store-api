import { createImportProductsFile } from './create-import-products-file';

describe('# @services/product::createImportProductsFile', () => {
  it('should respect the uploadStore.getSignedUrl contract', async () => {
    const signedUrl = 'signed-url';
    const getSignedUrl = jest.fn(async () => signedUrl);
    const uploadStore = { getSignedUrl };
    const importProductsFile = createImportProductsFile({ uploadStore });
    await importProductsFile({ query: { name: 'file' } });
    expect(getSignedUrl).toHaveBeenCalledTimes(1);
    expect(getSignedUrl).toHaveBeenCalledWith('file');
  });

  describe('when passed uploadStore.getSignedUrl resolves', () => {
    it('should return success response with url', async () => {
      const signedUrl = 'signed-url';
      const getSignedUrl = jest.fn(async () => signedUrl);
      const uploadStore = { getSignedUrl };
      const importProductsFile = createImportProductsFile({ uploadStore });
      const result = await importProductsFile({ query: { name: 'file' } });
      expect(result).toStrictEqual({ statusCode: 200, body: signedUrl });
    });
  });

  describe('when passed uploadStore.getSignedUrl rejects', () => {
    it('should return success response with url', async () => {
      const getSignedUrlError = new Error('failed to create signed url');
      const getSignedUrl = jest.fn(async () =>
        Promise.reject(getSignedUrlError),
      );
      const uploadStore = { getSignedUrl };
      const importProductsFile = createImportProductsFile({ uploadStore });
      const error = await importProductsFile({ query: { name: 'file' } }).catch(
        (error) => error,
      );
      expect(error).toStrictEqual(getSignedUrlError);
    });
  });
});
