import { httpAwsResponse } from '../../lib';

const logSuccess = (response) => {
  return httpAwsResponse.toSuccessAwsResponse({
    statusCode: 200,
    body: response,
  });
};
const logError = () => {
  return httpAwsResponse.toSuccessAwsResponse({
    statusCode: 500,
    body: 'Internal Server Error',
  });
};
export const response = {
  toSuccessAwsResponse: logSuccess,
  toErrorAwsResponse: logError,
};
