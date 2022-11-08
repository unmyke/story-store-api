import { Errors } from '@lib/errors';

import { ParsersByMethod } from './methods';

export const toHttpRequest = ({ method, params, query, body }) => {
  const parse = ParsersByMethod[method];
  if (!parse) throw new Errors.BadRequest(`method "${method}" not implemented`);
  return parse({ params, query, body });
};
