import { toAwsHttpErrorResponse } from './to-aws-http-error-response';
import { toAwsHttpResponse } from './to-aws-http-response';

export const httpAwsResponse = {
  toSuccessAwsResponse: toAwsHttpResponse,
  toErrorAwsResponse: toAwsHttpErrorResponse,
};
