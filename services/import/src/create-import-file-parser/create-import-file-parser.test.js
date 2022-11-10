import { Readable } from 'stream';

import { ErrorTypes } from '@lib/errors';

import { createImportFileParser } from './create-import-file-parser';

describe('# @services/product::createImportFileParser', () => {
  const config = { dirs: { uploaded: 'uploaded', parsed: 'parsed' } };
  const noop = () => {};

  describe('when passed file path inside upload directory', () => {
    const bucket = 'bucket';
    const file = `${config.dirs.uploaded}/file`;

    it('should respect the uploadStore contracts', async () => {
      const getFileStream = jest.fn(async () => Readable.from([]));
      const moveFile = jest.fn();
      const uploadStore = { getFileStream, moveFile };
      const importProductsFile = createImportFileParser({
        config,
        uploadStore,
      });
      await importProductsFile({ bucket, file });
      expect(getFileStream).toHaveBeenCalledTimes(1);
      expect(getFileStream).toHaveBeenCalledWith({ bucket, file });
      expect(moveFile).toHaveBeenCalledTimes(1);
      expect(moveFile).toHaveBeenCalledWith({
        bucket,
        file,
        to: config.dirs.parsed,
      });
    });

    describe('when uploadStore.getFileStream and uploadStore.moveFile resolves', () => {
      describe('- resolves to file stream', () => {
        it('should log the cvs rows', async () => {
          const getFileStream = async () =>
            Readable.from('"field"\n"value1"\n"value2"\n');
          const spyLog = jest.spyOn(console, 'log');
          spyLog.mockReset();
          const uploadStore = { getFileStream, moveFile: noop };
          const importProductsFile = createImportFileParser({
            config,
            uploadStore,
          });
          await importProductsFile({ bucket, file });
          expect(spyLog).toHaveBeenCalledTimes(2);
          expect(spyLog).toHaveBeenNthCalledWith(1, { field: 'value1' });
          expect(spyLog).toHaveBeenNthCalledWith(2, { field: 'value2' });
        });
      });
    });

    describe('when uploadStore.getFileStream rejects with error', () => {
      const getFileStreamError = new Error('File not found');
      const getFileStream = async () => Promise.reject(getFileStreamError);

      it('should throw', async () => {
        const spyLog = jest.spyOn(console, 'log');
        spyLog.mockReset();
        const uploadStore = { getFileStream, moveFile: noop };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
        });
        await expect(importProductsFile({ bucket, file })).rejects.toThrow({
          message:
            'An error accure while import file parser (bucket: "bucket", file: "uploaded/file")',
          type: ErrorTypes.DOMAIN.name,
          cause: getFileStreamError,
        });
      });

      it('should not log anything', async () => {
        const spyLog = jest.spyOn(console, 'log');
        spyLog.mockReset();
        const uploadStore = { getFileStream, moveFile: noop };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
        });
        await importProductsFile({ bucket, file }).catch(noop);
        expect(spyLog).not.toHaveBeenCalled();
      });

      it('should not call uploadStore.moveFile', async () => {
        const moveFile = jest.fn();
        const uploadStore = { getFileStream, moveFile };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
        });
        await importProductsFile({ bucket, file }).catch(noop);
        expect(moveFile).not.toHaveBeenCalled();
      });
    });

    describe('when uploadStore.moveFile rejects with error', () => {
      const moveFileError = new Error('File not found');
      const moveFile = async () => Promise.reject(moveFileError);

      it('should throw', async () => {
        const getFileStream = async () =>
          Readable.from('"field"\n"value1"\n"value2"\n');
        const spyLog = jest.spyOn(console, 'log');
        spyLog.mockReset();
        const uploadStore = { getFileStream, moveFile };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
        });
        await expect(importProductsFile({ bucket, file })).rejects.toThrow({
          message:
            'An error accure while import file parser (bucket: "bucket", file: "uploaded/file")',
          type: ErrorTypes.DOMAIN.name,
          cause: moveFileError,
        });
      });

      it('should not log anything', async () => {
        const getFileStream = async () =>
          Readable.from('"field"\n"value1"\n"value2"\n');
        const spyLog = jest.spyOn(console, 'log');
        spyLog.mockReset();
        const uploadStore = { getFileStream, moveFile };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
        });
        await importProductsFile({ bucket, file }).catch(noop);
        expect(spyLog).toHaveBeenCalledTimes(2);
      });

      it('should not call uploadStore.moveFile', async () => {
        const getFileStream = jest.fn(async () =>
          Readable.from('"field"\n"value1"\n"value2"\n'),
        );
        const uploadStore = { getFileStream, moveFile };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
        });
        await importProductsFile({ bucket, file }).catch(noop);
        expect(getFileStream).toHaveBeenCalledTimes(1);
      });
    });
  });
});
