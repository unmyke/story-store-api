import { errors } from '@lib/errors';

import { methods } from './methods';
import { parseRequest } from './parse-request';

export const toArgs = (request) => {
  console.info(request);
  const parsedReuest = parseRequest(request);
  return getArg(parsedReuest);
};

const getArg = ({ method: methodToFind, ...payload }) => {
  const { toArgs } =
    methods.find(({ method }) => method === methodToFind) || {};
  if (!toArgs)
    throw new errors.BadRequest(`method "${methodToFind}" not implemented`);
  return toArgs(payload);
};
