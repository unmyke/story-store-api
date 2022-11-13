import { Errors } from '@lib/errors';

import { createProcessCsvRow } from './create-process-csv-row';

export const createImportFileParser = ({
  config: {
    queues: { catalogItems },
    dirs,
  },
  uploadStore,
  eventBus,
}) => {
  const sendCsvRow = createProcessCsvRow(async (row) => {
    await eventBus.send(catalogItems, toProduct(row));
  });
  return async ({ bucket, file }) => {
    try {
      const importFileStream = await uploadStore.getFileStream({
        bucket,
        file,
      });
      await sendCsvRow(importFileStream);
      await uploadStore.moveFile({ bucket, file, to: dirs.parsed });
    } catch (error) {
      throw new Errors.Domain(
        `An error accure while import file parser (bucket: "${bucket}", file: "${file}")`,
        error,
      );
    }
  };
};

const toProduct = ({ title, description, count, price }) => ({
  title,
  description,
  count: toInt(count),
  price: toInt(price),
});
const toInt = (str) => parseInt(str, 10);
