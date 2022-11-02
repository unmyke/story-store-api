import { errors } from '@lib/errors';

import * as data from './data';

export const db = {
  select: (tableName) => {
    // eslint-disable-next-line import/namespace
    const table = data[tableName];
    if (!table) throw new errors.NotFound(`Table ${tableName} is not exists`);
    return table;
  },
};
