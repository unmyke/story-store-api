import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Errors } from '@lib/errors';

export const createNotifier = ({ region, baseArn }) => {
  const client = new SNSClient({ region });

  const send = async (topic, { subject, message }) => {
    const input = {
      Subject: subject,
      Message: message,
      TopicArn: `${baseArn}:${topic}`,
    };
    const command = new PublishCommand(input);
    try {
      await client.send(command);
    } catch (error) {
      throw new Errors.Notifier(
        `An error occured while sending message "${JSON.stringify({
          subject,
          message,
        })}" to topic "${topic}"`,
        error,
      );
    }
  };

  return { send };
};
