import { Errors } from '@lib/errors';

import { createProcessCsvRow } from './create-process-csv-row';

export const createImportFileParser = ({ config: { dirs }, uploadStore }) => {
  const logCsvRow = createProcessCsvRow(console.log);
  return async ({ bucket, file }) => {
    try {
      const importFileStream = await uploadStore.getFileStream({
        bucket,
        file,
      });
      await logCsvRow(importFileStream);
      await uploadStore.moveFile({ bucket, file, to: dirs.parsed });
    } catch (error) {
      throw new Errors.Domain(
        `An error accure while import file parser (bucket: "${bucket}", file: "${file}")`,
        error,
      );
    }
  };
};
