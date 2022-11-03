import { createValidate } from '@lib/create-validate';

import { configSchema } from './schemas';
import { createDbConfig } from './create-db-config';

const validate = createValidate(configSchema);

export const createConfig = () => {
  const db = createDbConfig();
  const config = { db };
  validate(config);
  return { db };
};
