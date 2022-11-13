import { Readable } from 'stream';

import { ErrorTypes } from '@lib/errors';

import { createImportFileParser } from './create-import-file-parser';

describe('# @services/product::createImportFileParser', () => {
  const config = {
    dirs: { uploaded: 'uploaded', parsed: 'parsed' },
    queues: { catalogItems: 'catalogItemsQueue' },
  };
  const noop = () => {};

  describe('when passed file path inside upload directory', () => {
    const bucket = 'bucket';
    const file = `${config.dirs.uploaded}/file`;

    it('should respect the uploadStore contracts', async () => {
      const getFileStream = jest.fn(async () => Readable.from([]));
      const moveFile = jest.fn();
      const uploadStore = { getFileStream, moveFile };
      const eventBus = { send: noop };
      const importProductsFile = createImportFileParser({
        config,
        uploadStore,
        eventBus,
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
        it('should send cvs rows', async () => {
          const getFileStream = async () =>
            Readable.from(
              '"title","description","price","count"\n"title1","description1","1","1"\n"title2","description2","2","2"\n',
            );
          const send = jest.fn();
          const eventBus = { send };
          const uploadStore = { getFileStream, moveFile: noop };
          const importProductsFile = createImportFileParser({
            config,
            uploadStore,
            eventBus,
          });
          await importProductsFile({ bucket, file });
          expect(send).toHaveBeenCalledTimes(2);
          expect(send).toHaveBeenNthCalledWith(1, 'catalogItemsQueue', {
            title: 'title1',
            description: 'description1',
            price: 1,
            count: 1,
          });
          expect(send).toHaveBeenNthCalledWith(2, 'catalogItemsQueue', {
            title: 'title2',
            description: 'description2',
            price: 2,
            count: 2,
          });
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
        const eventBus = { send: noop };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
          eventBus,
        });
        await expect(importProductsFile({ bucket, file })).rejects.toThrow({
          message:
            'An error accure while import file parser (bucket: "bucket", file: "uploaded/file")',
          type: ErrorTypes.DOMAIN.name,
          cause: getFileStreamError,
        });
      });

      it('should not send anything', async () => {
        const uploadStore = { getFileStream, moveFile: noop };
        const send = jest.fn();
        const eventBus = { send };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
          eventBus,
        });
        await importProductsFile({ bucket, file }).catch(noop);
        expect(send).not.toHaveBeenCalled();
      });

      it('should not call uploadStore.moveFile', async () => {
        const moveFile = jest.fn();
        const uploadStore = { getFileStream, moveFile };
        const eventBus = { send: noop };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
          eventBus,
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
          Readable.from(
            '"title","description","price","count"\n"title1","description1","1","1"\n"title2","description2","2","2"\n',
          );
        const spyLog = jest.spyOn(console, 'log');
        spyLog.mockReset();
        const uploadStore = { getFileStream, moveFile };
        const eventBus = { send: noop };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
          eventBus,
        });
        await expect(importProductsFile({ bucket, file })).rejects.toThrow({
          message:
            'An error accure while import file parser (bucket: "bucket", file: "uploaded/file")',
          type: ErrorTypes.DOMAIN.name,
          cause: moveFileError,
        });
      });

      it('should send row', async () => {
        const getFileStream = async () =>
          Readable.from(
            '"title","description","price","count"\n"title1","description1","1","1"\n"title2","description2","2","2"\n',
          );
        const uploadStore = { getFileStream, moveFile };
        const send = jest.fn();
        const eventBus = { send };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
          eventBus,
        });
        await importProductsFile({ bucket, file }).catch(noop);
        expect(send).toHaveBeenCalledTimes(2);
      });

      it('should not call uploadStore.moveFile', async () => {
        const getFileStream = jest.fn(async () =>
          Readable.from(
            '"title","description","price","count"\n"title1","description1","1","1"\n"title2","description2","2","2"\n',
          ),
        );
        const uploadStore = { getFileStream, moveFile };
        const eventBus = { send: noop };
        const importProductsFile = createImportFileParser({
          config,
          uploadStore,
          eventBus,
        });
        await importProductsFile({ bucket, file }).catch(noop);
        expect(getFileStream).toHaveBeenCalledTimes(1);
      });
    });
  });
});
