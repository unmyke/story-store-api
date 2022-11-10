import db from './db.json';
import common from './common.json';
import simpleAuth from './simple-auth.json';
import iamAuth from './iam-auth.json';

const schema = {
  schema: db,
  references: [common, simpleAuth, iamAuth],
};

export { schema };
