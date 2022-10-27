import { errors } from '@lib/errors';

import { getParser } from './get-parser';

export const parseRequest = (request) => {
  const { name: requestType, parse } = getParser(request);
  try {
    return parse();
  } catch (error) {
    throw new errors.BadRequest(`"${requestType}" request is incorrect`, error);
  }
};
