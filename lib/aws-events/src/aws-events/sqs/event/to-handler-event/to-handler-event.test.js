import { awsSqsEvents } from './aws-sqs-events';
import { toHandlerEvent } from './to-handler-event';

describe('# @lib/aws-events::sqs::event::toHandlerEvent', () => {
  describe('when passed AWS SQS events', () => {
    it('should return array of SQS handler events', () => {
      expect(toHandlerEvent(awsSqsEvents)).toStrictEqual([
        {
          context: {
            partition: 'partition-1',
            messageId: 'message-id-1',
            senderId: 'sender-id-1',
          },
          payload: { test: 'test-1' },
        },
        {
          context: {
            partition: 'partition-2',
            messageId: 'message-id-2',
            senderId: 'sender-id-2',
          },
          payload: { test: 'test-2' },
        },
      ]);
    });
  });
});
