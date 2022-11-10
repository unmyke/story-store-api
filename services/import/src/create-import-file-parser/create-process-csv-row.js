import { Writable } from 'stream';
import { pipeline } from 'stream/promises';

import { Errors } from '@lib/errors';
import csvParser from 'csv-parser';

export const createProcessCsvRow = (processRow) => {
  const csvParserTransformStream = csvParser({ strict: true });
  const processRowWritableStream = createProcessRowWritableStream(processRow);
  return async (fileStream) =>
    pipeline(fileStream, csvParserTransformStream, processRowWritableStream);
};

const createProcessRowWritableStream = (processRow) =>
  new Writable({
    objectMode: true,
    write(row, _, callback) {
      try {
        processRow(row);
        callback(null, row);
      } catch (error) {
        callback(
          new Errors.Domain('An error occurred while parsing csv-file', error),
        );
      }
    },
  });
