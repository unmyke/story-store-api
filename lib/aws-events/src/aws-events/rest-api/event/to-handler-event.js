import { toHttpRequest } from '../../../lib';

export const toHandlerEvent = (request) => {
  const {
    httpMethod: method,
    queryStringParameters,
    multiValueQueryStringParameters,
    body: rawBody,
    pathParameters,
  } = request;
  const body = rawBody ? JSON.parse(rawBody) : {};
  const params = pathParameters ? pathParameters : {};
  const query = mergeQuery({
    singleValueQueryParameters: queryStringParameters || {},
    multiValueQueryParameters: multiValueQueryStringParameters || {},
  });
  return toHttpRequest({ method, params, query, body });
};

const mergeQuery = ({
  singleValueQueryParameters,
  multiValueQueryParameters,
}) => {
  const singleValueQueryParameterEntries = Object.entries(
    singleValueQueryParameters,
  );
  const mergedQueryEntries = singleValueQueryParameterEntries.map(
    ([parameterName, singleValueQueryValue]) => {
      const multiValueQueryValue = multiValueQueryParameters[parameterName];
      if (multiValueQueryValue.length > 1)
        return [parameterName, multiValueQueryValue];
      return [parameterName, singleValueQueryValue];
    },
  );
  return Object.fromEntries(mergedQueryEntries);
};
