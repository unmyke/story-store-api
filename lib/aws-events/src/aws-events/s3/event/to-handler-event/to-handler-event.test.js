import { awsS3Events } from './aws-s3-events';
import { toHandlerEvent } from './to-handler-event';

describe('# @lib/aws-events::s3::event::toHandlerEvent', () => {
  describe('when passed AWS S3 events', () => {
    it('should return array of S3 handler events', () => {
      expect(toHandlerEvent(awsS3Events)).toStrictEqual([
        { s3Event: 'created', bucket: 'test-bucket', file: 'test/key1' },
        { s3Event: 'deleted', bucket: 'test-bucket', file: 'test/key2' },
      ]);
    });
  });
});
