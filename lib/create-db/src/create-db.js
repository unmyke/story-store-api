import { createDbConfig } from './create-db-config';
import { createQueryRunner } from './create-query-runner';
import { createClientFactory } from './create-client-factory';

export const createDb = (config) => {
  const dbConfig = createDbConfig(config);
  const createClient = createClientFactory(dbConfig);
  return createQueryRunner(createClient);
};
