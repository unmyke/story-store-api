import { AwsEventHandlerTypes } from '@lib/aws-events';
import { createValidate } from '@lib/create-validate';

export const createValidateHandlerEvent = ({ handlerType, schema }) => {
  const validate = createValidate(schema);
  return (eventOrEvents) => {
    if (
      !Array.isArray(eventOrEvents) ||
      handlerType === AwsEventHandlerTypes.MULTIPLE_EVENTS
    )
      return validate(eventOrEvents);
    return eventOrEvents.map((event) => validate(event));
  };
};
