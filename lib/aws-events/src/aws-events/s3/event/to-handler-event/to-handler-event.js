export const toHandlerEvent = ({ Records: awsS3Events }) =>
  awsS3Events.map(toS3Event);
const toS3Event = (awsS3Event) => {
  const {
    eventName: awsS3EventName,
    s3: {
      bucket: { name: bucket },
      object: { key: file },
    },
  } = awsS3Event;
  const s3Event = getS3Event(awsS3EventName);
  return { s3Event, bucket, file };
};

const getS3Event = (awsS3EventName) => {
  const [awsS3EventPrefix] = awsS3EventName.split(':');
  return AwsS3EventPrefixes[awsS3EventPrefix];
};
const AwsS3EventPrefixes = {
  ObjectCreated: 'created',
  ObjectRemoved: 'deleted',
};
