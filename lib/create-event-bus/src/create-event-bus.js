import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Errors } from '@lib/errors';

export const createEventBus = ({ region, baseUrl }) => {
  const client = new SQSClient({ region });

  const send = async (topic, message) => {
    const input = {
      QueueUrl: new URL(topic, baseUrl).href,
      MessageBody: JSON.stringify(message),
    };
    const command = new SendMessageCommand(input);
    try {
      await client.send(command);
    } catch (error) {
      throw new Errors.EventBus(
        `An error occured while sending message "${input.MessageBody}" to topic "${topic}"`,
        error,
      );
    }
  };

  return { send };
};
