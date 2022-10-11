export const createResponse = ({ code, result }) => ({
  statusCode: code,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(result),
});
