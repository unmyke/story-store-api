import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ErrorTypes } from '@lib/errors';
import { mockClient } from 'aws-sdk-client-mock';

import 'aws-sdk-client-mock-jest';
import { createEventBus } from './create-event-bus';

describe('# @lib/create-event-bus', () => {
  const config = {
    baseUrl: 'https://base.url',
    region: 'region',
  };

  it('should return event bus', () => {
    expect(createEventBus(config)).toStrictEqual({
      send: expect.any(Function),
    });
  });

  describe('## send', () => {
    const sqsClientMock = mockClient(SQSClient);

    beforeEach(() => {
      sqsClientMock.reset();
    });

    it('should respect client contract', async () => {
      const { send } = createEventBus(config);
      await send('topic', { message: 'message' });
      expect(sqsClientMock).toHaveReceivedCommandTimes(SendMessageCommand, 1);
      expect(sqsClientMock).toHaveReceivedCommandWith(SendMessageCommand, {
        QueueUrl: 'https://base.url/topic',
        MessageBody: '{"message":"message"}',
      });
    });

    describe('when client.send resolves', () => {
      it('should resolves', async () => {
        sqsClientMock.on(SendMessageCommand).resolves();
        const { send } = createEventBus(config);
        await expect(
          send('topic', { message: 'message' }),
        ).resolves.toBeUndefined();
      });
    });
    describe('when client.send rejects', () => {
      it('should rejects', async () => {
        const sqsError = new Error('sqs-error');
        sqsClientMock.on(SendMessageCommand).rejects(sqsError);
        const { send } = createEventBus(config);
        await expect(send('topic', { message: 'message' })).rejects.toThrow({
          message:
            'An error occured while sending message "{"message":"message"}" to topic "topic"',
          type: ErrorTypes.EVENT_BUS.name,
          cause: sqsError,
        });
      });
    });
  });
});
