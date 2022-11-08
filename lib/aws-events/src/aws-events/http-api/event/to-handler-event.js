import { toHttpRequest } from '../../../lib';

export const toHandlerEvent = (httpApiEvent) => {
  const {
    queryStringParameters = {},
    requestContext: {
      http: { method },
    },
    body: rawBody = '{}',
    pathParameters: params = {},
  } = httpApiEvent;
  const body = JSON.parse(rawBody);
  const query = parseQueryParameters(queryStringParameters);
  return toHttpRequest({ method, params, query, body });
};

const parseQueryParameters = (queryStringParameters) => {
  const parametersEntries = Object.entries(queryStringParameters);
  const parsedParametersEntries = parametersEntries.map(
    ([parameter, value]) => {
      const splittedValues = value.split(',');
      return [parameter, splittedValues.length > 1 ? splittedValues : value];
    },
  );
  return Object.fromEntries(parsedParametersEntries);
};
