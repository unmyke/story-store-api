export const awsSqsEvents = {
  Records: [
    {
      messageId: 'message-id-1',
      receiptHandle: 'MessageReceiptHandle',
      body: '{"test":"test-1"}',
      attributes: {
        ApproximateReceiveCount: '1',
        SentTimestamp: '1523232000000',
        SenderId: 'sender-id-1',
        ApproximateFirstReceiveTimestamp: '1523232000001',
      },
      messageAttributes: {},
      md5OfBody: '841a2d689ad86bd1611447453c22c6fc',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:partition-1:sqs:us-east-1:sender-id-1:queue-name-1',
      awsRegion: 'us-east-1',
    },
    {
      messageId: 'message-id-2',
      receiptHandle: 'MessageReceiptHandle',
      body: '{"test":"test-2"}',
      attributes: {
        ApproximateReceiveCount: '1',
        SentTimestamp: '1523232000000',
        SenderId: 'sender-id-2',
        ApproximateFirstReceiveTimestamp: '1523232000001',
      },
      messageAttributes: {},
      md5OfBody: '841a2d689ad86bd1611447453c22c6fc',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:partition-2:sqs:us-east-1:sender-id-2:queue-name-2',
      awsRegion: 'us-east-1',
    },
  ],
};
