import { AwsEventHandlerTypes } from '@lib/aws-events';

import { createHandleEvent } from './create-handle-event';

describe('# @lib/createEventHandlers::createHandleEvent', () => {
  it('should return function', () => {
    const handleEvent = createHandleEvent({
      handlerType: AwsEventHandlerTypes.SINGLE_EVENT,
      handler: async () => {},
    });
    expect(handleEvent).toStrictEqual(expect.any(Function));
  });

  describe('## eventHandler', () => {
    describe('## single event handler', () => {
      describe('when passed single event', () => {
        it('should call handler event', async () => {
          const event = 'event';
          const handler = jest.fn(async (item) => item);
          const handleEvents = createHandleEvent({
            handlerType: AwsEventHandlerTypes.SINGLE_EVENT,
            handler,
          });
          const result = await handleEvents(event);
          expect(result).toStrictEqual(event);
          expect(handler).toHaveBeenCalledTimes(1);
          expect(handler).toHaveBeenCalledWith(event);
        });
      });

      describe('when passed multiple events', () => {
        it('should call handler for each event', async () => {
          const events = ['event1', 'event2', 'event3'];
          const handler = jest.fn(async (item) => item);
          const handleEvents = createHandleEvent({
            handlerType: AwsEventHandlerTypes.SINGLE_EVENT,
            handler,
          });
          const result = await handleEvents(events);
          expect(result).toStrictEqual(events);
          expect(handler).toHaveBeenCalledTimes(events.length);
          events.forEach((event, index) => {
            expect(handler).toHaveBeenNthCalledWith(index + 1, event);
          });
        });
      });
    });

    describe('## multiple events handler', () => {
      describe('when passed single event', () => {
        it('should call handler with event', async () => {
          const event = 'event1';
          const handler = jest.fn(async (item) => item);
          const handleEvents = createHandleEvent({
            handlerType: AwsEventHandlerTypes.MULTIPLE_EVENTS,
            handler,
          });
          const result = await handleEvents(event);
          expect(result).toStrictEqual(event);
          expect(handler).toHaveBeenCalledTimes(1);
          expect(handler).toHaveBeenCalledWith(event);
        });
      });

      describe('when passed multiple events', () => {
        it('should call handler with array of events', async () => {
          const events = ['event1', 'event2', 'event3'];
          const handler = jest.fn(async (item) => item);
          const handleEvents = createHandleEvent({
            handlerType: AwsEventHandlerTypes.MULTIPLE_EVENTS,
            handler,
          });
          const result = await handleEvents(events);
          expect(result).toStrictEqual(events);
          expect(handler).toHaveBeenCalledTimes(1);
          expect(handler).toHaveBeenCalledWith(events);
        });
      });
    });
  });
});
