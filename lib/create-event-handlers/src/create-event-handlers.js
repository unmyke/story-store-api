import { AwsEventHandlerTypes, AwsEvents } from '@lib/aws-events';
import { Errors } from '@lib/errors';

import { createEventHandler } from './create-event-handler';

export const createEventHandlers = ({ handlers, context }) => {
  const handlerEntries = Object.entries(handlers);
  const getwayHandlerEntries = handlerEntries.map(
    ([
      name,
      {
        eventType,
        handlerType = AwsEventHandlerTypes.SINGLE_EVENT,
        schemas,
        factory: handlerFactory,
      },
    ]) => {
      const awsEventMappers = AwsEvents[eventType];
      if (!awsEventMappers)
        throw new Errors.Handler(`Handle "${eventType}" type not implemented`);
      const handler = handlerFactory(context);
      const eventHandler = createEventHandler({
        name,
        handlerType,
        handler,
        schemas,
        awsEventType: eventType,
        awsEventMappers,
      });
      return [name, eventHandler];
    },
  );
  return Object.fromEntries(getwayHandlerEntries);
};
