import { createResponse } from './create-response';
import { handleError } from './handle-error';
import { toArgs } from './to-args';

export const createGatewayHandlers = ({ handlers, context }) => {
  const handlerEntries = Object.entries(handlers);
  const getwayHandlerEntries = handlerEntries.map(([name, handlerFactory]) => {
    const handler = handlerFactory(context);
    const gatewayHandler = createGatewayHandler(handler);
    return [name, gatewayHandler];
  });
  return Object.fromEntries(getwayHandlerEntries);
};

const createGatewayHandler = (handler) => async (request) => {
  try {
    const args = toArgs(request);
    const result = await handler(args);
    return createResponse({ code: 201, result });
  } catch (error) {
    return handleError(error);
  }
};
