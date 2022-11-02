import { types as errorTypes } from '@lib/errors';

import { createResponse } from './create-response';

export const handleError = (error) => {
  console.debug(error);
  if (isDomain(error))
    return createResponse({
      statusCode: 400,
      body: { message: `Bad Request: ${error.message}` },
    });
  if (isBadRequest(error))
    return createResponse({
      statusCode: 400,
      body: { message: `Bad Request: ${error.message}` },
    });
  if (isValidation(error))
    return createResponse({
      statusCode: 400,
      body: { message: `Bad Request: ${error.message}`, errors: error.errors },
    });
  if (isNotFound(error))
    return createResponse({
      statusCode: 404,
      body: { message: error.message },
    });
  return createResponse({
    statusCode: 500,
    body: { message: 'Internal Server Error' },
  });
};

const isDomain = (error) => error.type === errorTypes.DOMAIN.name;
const isBadRequest = (error) =>
  error.type === errorTypes.HTTP.name &&
  error.code === errorTypes.HTTP.codes.BAD_REQUEST;
const isValidation = (error) => error.type === errorTypes.VALIDATION.name;
const isNotFound = (error) =>
  error.type === errorTypes.DATA_ACCESS.name &&
  error.code === errorTypes.DATA_ACCESS.codes.NOT_FOUND;
