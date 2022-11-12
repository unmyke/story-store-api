import * as httpApi from './http-api';
import * as restApi from './rest-api';
import * as s3 from './s3';
import * as sqs from './sqs';

export const AwsEvents = {
  [httpApi.name]: httpApi,
  [restApi.name]: restApi,
  [s3.name]: s3,
  [sqs.name]: sqs,
};
