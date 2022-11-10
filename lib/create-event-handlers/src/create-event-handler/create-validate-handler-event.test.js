import { AwsEventHandlerTypes } from '@lib/aws-events';

import { createValidateHandlerEvent } from './create-validate-handler-event';

describe('# @lib/createEventHandlers::createValidateHandlerEvent', () => {
  it('should return function', () => {
    const schema = {};
    const handleEvent = createValidateHandlerEvent({
      handlerType: AwsEventHandlerTypes.SINGLE_EVENT,
      schema,
    });
    expect(handleEvent).toStrictEqual(expect.any(Function));
  });

  describe('## validateHandlerEvent', () => {
    describe('## single event handler', () => {
      const schema = { type: 'string' };
      describe('when passed single event', () => {
        it('should validate event', async () => {
          const event = 'event';
          const validateHandlerEvent = createValidateHandlerEvent({
            handlerType: AwsEventHandlerTypes.SINGLE_EVENT,
            schema,
          });
          expect(() => validateHandlerEvent(event)).not.toThrow();
        });
      });

      describe('when passed multiple events', () => {
        it('should call handler for each event', async () => {
          const events = ['event1', 'event2', 'event3'];
          const validateHandlerEvent = createValidateHandlerEvent({
            handlerType: AwsEventHandlerTypes.SINGLE_EVENT,
            schema,
          });
          expect(() => validateHandlerEvent(events)).not.toThrow();
        });
      });
    });

    describe('## multiple events handler', () => {
      describe('when passed single event', () => {
        it('should call handler with event', async () => {
          const schema = { type: 'string' };
          const event = 'event1';
          const validateHandlerEvent = createValidateHandlerEvent({
            handlerType: AwsEventHandlerTypes.MULTIPLE_EVENTS,
            schema,
          });
          expect(() => validateHandlerEvent(event)).not.toThrow();
        });
      });

      describe('when passed multiple events', () => {
        it('should call handler with array of events', async () => {
          const schema = { type: 'array', items: { type: 'string' } };
          const events = ['event1', 'event2', 'event3'];
          const validateHandlerEvent = createValidateHandlerEvent({
            handlerType: AwsEventHandlerTypes.MULTIPLE_EVENTS,
            schema,
          });
          const result = await validateHandlerEvent(events);
          expect(result).toStrictEqual(events);
        });
      });
    });
  });
});
