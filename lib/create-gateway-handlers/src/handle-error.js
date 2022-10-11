import { types as errorTypes } from '@lib/errors';

import { createResponse } from './create-response';

export const handleError = (error) => {
  console.error(error.message);
  if (isDomain(error))
    return createResponse({
      code: 400,
      result: { message: `Bad Request: ${error.message}` },
    });
  if (isBadRequest(error))
    return createResponse({
      code: 400,
      result: { message: `Bad Request: ${error.message}` },
    });
  if (isNotFound(error))
    return createResponse({
      code: 404,
      result: { message: error.message },
    });
  return createResponse({
    code: 500,
    result: { message: 'Internal Server Error' },
  });
};

const isDomain = (error) => error.type === errorTypes.DOMAIN.name;
const isBadRequest = (error) =>
  error.type === errorTypes.HTTP.name &&
  error.code === errorTypes.HTTP.codes.BAD_REQUEST;
const isNotFound = (error) =>
  error.type === errorTypes.DATA_ACCESS.name &&
  error.code === errorTypes.DATA_ACCESS.codes.NOT_FOUND;
