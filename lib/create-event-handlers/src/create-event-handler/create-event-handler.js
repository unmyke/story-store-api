import { createValidate } from '@lib/create-validate';

import { createValidateHandlerResponse } from './create-validate-handler-response';
import { createToHandlerEvent } from './create-to-handler-event';
import { createHandleResponse } from './create-handle-response';

export const createEventHandler = ({
  name,
  handlerType,
  handler,
  schemas,
  awsEventType,
  awsEventMappers,
}) => {
  const validateAwsEvent = createValidate(awsEventMappers.event.awsEventSchema);
  const validateHandlerEvent = createValidate(schemas.event);
  const validateHandlerResponse = createValidateHandlerResponse({
    name,
    schema: schemas.response,
  });
  const toHandlerEvent = createToHandlerEvent({
    awsEventType,
    toHandlerEvent: awsEventMappers.event.toHandlerEvent,
  });
  const handleResponse = createHandleResponse({ type: handlerType, handler });
  const { toSuccessAwsResponse, toErrorAwsResponse } = awsEventMappers.response;
  return async (awsEvent) => {
    try {
      validateAwsEvent(awsEvent);
      const handlerEvent = toHandlerEvent(awsEvent);
      validateHandlerEvent(handlerEvent);
      const handlerResponse = await handleResponse(handlerEvent);
      validateHandlerResponse(handlerResponse);
      return toSuccessAwsResponse(handlerResponse);
    } catch (error) {
      return toErrorAwsResponse(error);
    }
  };
};
