import { Errors, ErrorTypes } from '@lib/errors';

export const createToHandlerEvent = ({ awsEventType, toHandlerEvent }) => {
  return (awsEvent) => {
    try {
      return toHandlerEvent(awsEvent);
    } catch (error) {
      if (error.code === ErrorTypes.HTTP.codes.BAD_REQUEST) throw error;
      throw new Errors.BadRequest(`"${awsEventType}" event is incorrect`);
    }
  };
};
