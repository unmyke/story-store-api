import { ConfigSections, createConfig } from '@lib/create-config';
import { createEventBus } from '@lib/create-event-bus';
import { createEventHandlers } from '@lib/create-event-handlers';
import { createUploadStore } from '@lib/create-upload-store';

import { handler as createImportProductsFile } from './create-import-products-file';
import { handler as createImportFileParser } from './create-import-file-parser';

const config = createConfig(
  ConfigSections.UPLOAD_STORE,
  ConfigSections.EVENT_BUS,
  ConfigSections.QUEUES,
);
const uploadStore = createUploadStore(config[ConfigSections.UPLOAD_STORE]);
const eventBus = createEventBus(config[ConfigSections.EVENT_BUS]);
const handlersConfig = {
  dirs: config[ConfigSections.UPLOAD_STORE].dirs,
  queues: config.queues,
};

export const { importProductsFile, importFileParser } = createEventHandlers({
  handlers: {
    importProductsFile: createImportProductsFile,
    importFileParser: createImportFileParser,
  },
  context: {
    config: handlersConfig,
    uploadStore,
    eventBus,
  },
});
