export const toHandlerEvent = ({ Records: awsSqsEvents }) =>
  awsSqsEvents.map(toSqsEvent);
const toSqsEvent = (awsSqsEvent) => {
  const {
    messageId,
    body,
    attributes: { SenderId: senderId },
    eventSourceARN,
  } = awsSqsEvent;
  const [, partition] = eventSourceARN.split(':');
  const context = { messageId, senderId, partition };
  const payload = JSON.parse(body);
  return { context, payload };
};
