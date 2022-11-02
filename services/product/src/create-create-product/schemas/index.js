import request from './request.json';
import requestBody from './request-body.json';
import response from './response.json';
import response201 from './response-201.json';

export const schemas = {
  request: { schema: request, references: [requestBody] },
  response: { schema: response, references: [response201] },
};
