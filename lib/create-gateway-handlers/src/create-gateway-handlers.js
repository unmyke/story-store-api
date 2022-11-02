import { createResponse } from './create-response';
import { createValidate } from './create-validate';
import { handleError } from './handle-error';
import { parseHandlerRequest } from './parse-handler-request';

export const createGatewayHandlers = ({ handlers, context }) => {
  const handlerEntries = Object.entries(handlers);
  const getwayHandlerEntries = handlerEntries.map(
    ([name, { schemas, factory: handlerFactory }]) => {
      const handler = handlerFactory(context);
      const gatewayHandler = createGatewayHandler({
        name,
        schemas,
        handler,
      });
      return [name, gatewayHandler];
    },
  );
  return Object.fromEntries(getwayHandlerEntries);
};

const createGatewayHandler = ({ name, schemas, handler }) => {
  const { validateRequest, validateResponse } = createValidate({
    name,
    schemas,
  });
  return async (rawRequest) => {
    try {
      const handlerRequest = parseHandlerRequest(rawRequest);
      validateRequest(handlerRequest);
      const handlerResponse = await handler(handlerRequest);
      validateResponse(handlerResponse);
      return createResponse(handlerResponse);
    } catch (error) {
      return handleError(error);
    }
  };
};
