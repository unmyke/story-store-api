const predicate = (request) => request.version === '2.0';
const parse = (request) => {
  const {
    queryStringParameters = {},
    requestContext: {
      http: { method },
    },
    body: rawBody = '{}',
    pathParameters: params = {},
  } = request;
  const body = JSON.parse(rawBody);
  const query = parseQueryParameters(queryStringParameters);
  return { method, params, query, body };
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

export const httpApi = { predicate, parse };
