import { Readable } from 'stream';

import { ErrorTypes } from '@lib/errors';

import { createProcessCsvRow } from './create-process-csv-row';

describe('# @services/product::createImportFileParser::createProcessCsvRow', () => {
  it('should return function', () => {
    const processCsvRow = createProcessCsvRow(() => {});
    expect(processCsvRow).toStrictEqual(expect.any(Function));
  });

  describe('## processCsvRow', () => {
    describe('when process csv file callback successful handle rows', () => {
      describe('when passed a csv file stream', () => {
        it('should call process row callback', async () => {
          const csvProcess = jest.fn(async () => {});
          const processCsvRow = createProcessCsvRow(csvProcess);
          const stream = Readable.from(
            '"field1","field2"\n"value11","value12"\n"value21","value22"\n',
            { encoding: 'utf8' },
          );
          await processCsvRow(stream);
          expect(csvProcess).toHaveBeenCalledTimes(2);
          expect(csvProcess).toHaveBeenNthCalledWith(1, {
            field1: 'value11',
            field2: 'value12',
          });
          expect(csvProcess).toHaveBeenNthCalledWith(2, {
            field1: 'value21',
            field2: 'value22',
          });
        });
      });

      describe('when passed not a csv file stream', () => {
        it('should not call process row callback', async () => {
          const csvProcess = jest.fn(async () => {});
          const processCsvRow = createProcessCsvRow(csvProcess);
          const stream = Readable.from(Buffer.from([1, 2, 3]));
          await processCsvRow(stream);
          expect(csvProcess).not.toHaveBeenCalled();
        });
      });
    });

    describe('when process csv file callback failed', () => {
      it('should throw Domain error', async () => {
        const processError = new Error('fail');
        const csvProcess = () => {
          throw processError;
        };
        const processCsvRow = createProcessCsvRow(csvProcess);
        const stream = Readable.from(
          '"field1","field2"\n"value11","value12"\n"value21","value22"\n',
          { encoding: 'utf8' },
        );
        await expect(processCsvRow(stream)).rejects.toThrow({
          message: 'An error occurred while parsing csv-file',
          type: ErrorTypes.DOMAIN.name,
          cause: processError,
        });
      });
    });
  });
});
