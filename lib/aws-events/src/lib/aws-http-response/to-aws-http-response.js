const headers = { 'Content-Type': 'application/json' };

export const toAwsHttpResponse = ({ statusCode, body }) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});
