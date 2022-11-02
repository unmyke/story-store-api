const headers = { 'Content-Type': 'application/json' };

export const createResponse = ({ statusCode, body }) => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});
