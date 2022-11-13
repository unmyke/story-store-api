import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { ErrorTypes } from '@lib/errors';
import { mockClient } from 'aws-sdk-client-mock';

import 'aws-sdk-client-mock-jest';
import { createNotifier } from './create-notifier';

describe('# @lib/create-notifier', () => {
  const config = {
    baseArn: 'arn:aws:sns:base',
    region: 'region',
  };

  it('should return notifier', () => {
    expect(createNotifier(config)).toStrictEqual({
      send: expect.any(Function),
    });
  });

  describe('## send', () => {
    const snsClientMock = mockClient(SNSClient);

    beforeEach(() => {
      snsClientMock.reset();
    });

    it('should respect client contract', async () => {
      const { send } = createNotifier(config);
      await send('topic', { subject: 'subject', message: 'message' });
      expect(snsClientMock).toHaveReceivedCommandTimes(PublishCommand, 1);
      expect(snsClientMock).toHaveReceivedCommandWith(PublishCommand, {
        Subject: 'subject',
        Message: 'message',
        TopicArn: 'arn:aws:sns:base:topic',
      });
    });

    describe('when client.send resolves', () => {
      it('should resolves', async () => {
        snsClientMock.on(PublishCommand).resolves();
        const { send } = createNotifier(config);
        await expect(
          send('topic', { subject: 'subject', message: 'message' }),
        ).resolves.toBeUndefined();
      });
    });
    describe('when client.send rejects', () => {
      it('should rejects', async () => {
        const snsError = new Error('sns-error');
        snsClientMock.on(PublishCommand).rejects(snsError);
        const { send } = createNotifier(config);
        await expect(
          send('topic', { subject: 'subject', message: 'message' }),
        ).rejects.toThrow({
          message:
            'An error occured while sending message "{"subject":"subject","message":"message"}" to topic "topic"',
          type: ErrorTypes.NOTIFIER.name,
          cause: snsError,
        });
      });
    });
  });
});
