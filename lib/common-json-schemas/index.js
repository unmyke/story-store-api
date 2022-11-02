import uuidv4 from './schemas/uuid-v4.json';
import statusCodes from './schemas/status-codes.json';
import emptyObject from './schemas/empty-object.json';
import response200 from './schemas/responses/200.json';
import response201 from './schemas/responses/201.json';
import response400 from './schemas/responses/400.json';
import response404 from './schemas/responses/404.json';
import response500 from './schemas/responses/500.json';

export const commonJSONSchemas = [
  uuidv4,
  statusCodes,
  emptyObject,
  response200,
  response201,
  response400,
  response404,
  response500,
];
