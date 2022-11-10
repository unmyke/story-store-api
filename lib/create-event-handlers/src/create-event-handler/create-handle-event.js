import { AwsEventHandlerTypes } from '@lib/aws-events';

export const createHandleEvent = ({ handlerType, handler }) => {
  return (handlerEvent) =>
    handlerType === AwsEventHandlerTypes.MULTIPLE_EVENTS
      ? handlerEvent.map(handler)
      : handler(handlerEvent);
};
