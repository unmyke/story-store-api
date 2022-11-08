import { AwsEventHandlerTypes } from '@lib/aws-events';

export const createHandleResponse = ({ type, handler }) => {
  return (handlerEvent) =>
    type === AwsEventHandlerTypes.MULTIPLE_EVENTS
      ? handlerEvent.map(handler)
      : handler(handlerEvent);
};
