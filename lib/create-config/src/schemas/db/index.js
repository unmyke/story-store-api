import db from './db.json';
import common from './common.json';
import simpleAuth from './simple-auth.json';
import iamAuth from './iam-auth.json';

const dbSchema = {
  schema: db,
  references: [common, simpleAuth, iamAuth],
};

export { dbSchema };
