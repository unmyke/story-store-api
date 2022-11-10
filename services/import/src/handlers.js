import { ConfigSections, createConfig } from '@lib/create-config';
import { createEventHandlers } from '@lib/create-event-handlers';
import { createUploadStore } from '@lib/create-upload-store';

import { handler as createImportProductsFile } from './create-import-products-file';
import { handler as createImportFileParser } from './create-import-file-parser';

const config = createConfig(ConfigSections.UPLOAD_STORE);
const uploadStore = createUploadStore(config[ConfigSections.UPLOAD_STORE]);

export const { importProductsFile, importFileParser } = createEventHandlers({
  handlers: {
    importProductsFile: createImportProductsFile,
    importFileParser: createImportFileParser,
  },
  context: { config: config[ConfigSections.UPLOAD_STORE], uploadStore },
});
