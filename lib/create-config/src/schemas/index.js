import config from './config.json';
import { dbSchema } from './db';

const configSchema = {
  schema: config,
  references: [...dbSchema.references, dbSchema.schema],
};

export { configSchema };
