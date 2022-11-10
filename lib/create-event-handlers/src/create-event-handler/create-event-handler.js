import { createValidate } from '@lib/create-validate';

import { createValidateHandlerResponse } from './create-validate-handler-response';
import { createToHandlerEvent } from './create-to-handler-event';
import { createHandleEvent } from './create-handle-event';
import { createValidateHandlerEvent } from './create-validate-handler-event';

export const createEventHandler = ({
  name,
  handlerType,
  handler,
  schemas,
  awsEventType,
  awsEventMappers,
}) => {
  const validateAwsEvent = createValidate(awsEventMappers.event.awsEventSchema);
  const validateHandlerEvent = createValidateHandlerEvent({
    handlerType,
    schema: schemas.event,
  });
  const validateHandlerResponse = createValidateHandlerResponse({
    name,
    schema: schemas.response,
  });
  const toHandlerEvent = createToHandlerEvent({
    awsEventType,
    toHandlerEvent: awsEventMappers.event.toHandlerEvent,
  });
  const handleEvent = createHandleEvent({ handlerType, handler });
  const { toSuccessAwsResponse, toErrorAwsResponse } = awsEventMappers.response;
  return async (awsEvent) => {
    try {
      validateAwsEvent(awsEvent);
      const handlerEvent = toHandlerEvent(awsEvent);
      validateHandlerEvent(handlerEvent);
      console.info(
        `${name}: try to handle ${awsEventType} type event "${JSON.stringify(
          handlerEvent,
        )}"`,
      );
      const handlerResponse = await handleEvent(handlerEvent);
      console.info(
        `${name}: event successfuly handled.\n\tresponse: "${JSON.stringify(
          handlerResponse,
        )}"`,
      );
      validateHandlerResponse(handlerResponse);
      return toSuccessAwsResponse(handlerResponse);
    } catch (error) {
      console.error(error.message);
      console.debug(error);
      return toErrorAwsResponse(error);
    }
  };
};
