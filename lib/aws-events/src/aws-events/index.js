import * as httpApi from './http-api';
import * as restApi from './rest-api';

export const AwsEvents = {
  [httpApi.name]: httpApi,
  [restApi.name]: restApi,
};
