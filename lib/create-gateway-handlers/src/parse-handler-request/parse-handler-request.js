import { errors } from '@lib/errors';

import { methods } from './methods';
import { parseRequest } from './parse-request';

export const parseHandlerRequest = (rawRequest) => {
  const parsedRequest = parseRequest(rawRequest);
  console.info('Handle request: %s', JSON.stringify(parsedRequest));
  return getRequestByMethod(parsedRequest);
};

const getRequestByMethod = ({ method: methodToFind, params, query, body }) => {
  const { toHandlerRequest } =
    methods.find(({ method }) => method === methodToFind) || {};
  if (!toHandlerRequest)
    throw new errors.BadRequest(`method "${methodToFind}" not implemented`);
  return toHandlerRequest({ params, query, body });
};
