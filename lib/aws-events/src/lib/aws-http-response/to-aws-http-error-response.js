import { ErrorTypes } from '@lib/errors';

import { toAwsHttpResponse } from './to-aws-http-response';

export const toAwsHttpErrorResponse = (error) => {
  console.debug(error);
  if (isDomain(error))
    return toAwsHttpResponse({
      statusCode: 400,
      body: { message: `Bad Request: ${error.message}` },
    });
  if (isBadRequest(error))
    return toAwsHttpResponse({
      statusCode: 400,
      body: { message: `Bad Request: ${error.message}` },
    });
  if (isValidation(error))
    return toAwsHttpResponse({
      statusCode: 400,
      body: { message: `Bad Request: ${error.message}`, errors: error.errors },
    });
  if (isNotFound(error))
    return toAwsHttpResponse({
      statusCode: 404,
      body: { message: error.message },
    });
  return toAwsHttpResponse({
    statusCode: 500,
    body: { message: 'Internal Server Error' },
  });
};

const isDomain = (error) => error.type === ErrorTypes.DOMAIN.name;
const isBadRequest = (error) =>
  error.type === ErrorTypes.HTTP.name &&
  error.code === ErrorTypes.HTTP.codes.BAD_REQUEST;
const isValidation = (error) => error.type === ErrorTypes.VALIDATION.name;
const isNotFound = (error) =>
  error.type === ErrorTypes.DATA_ACCESS.name &&
  error.code === ErrorTypes.DATA_ACCESS.codes.NOT_FOUND;
