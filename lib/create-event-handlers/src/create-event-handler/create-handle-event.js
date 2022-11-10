import { AwsEventHandlerTypes } from '@lib/aws-events';

export const createHandleEvent = ({ handlerType, handler }) => {
  return (eventOrEvents) => {
    if (
      !Array.isArray(eventOrEvents) ||
      handlerType === AwsEventHandlerTypes.MULTIPLE_EVENTS
    )
      return handler(eventOrEvents);
    return Promise.all(eventOrEvents.map((event) => handler(event)));
  };
};
