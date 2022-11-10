import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Errors } from '@lib/errors';

import { createIsUploaded } from './lib';

export const createGetFileStream = ({ config, s3Client }) => {
  const isUploaded = createIsUploaded(config);
  return async ({ bucket, file }) => {
    if (!isUploaded({ bucket, file }))
      throw new Errors.UploadStore(
        `File "s3://${bucket}/${file}" is not inside upload bucket/folder`,
      );

    const input = { Bucket: config.bucket, Key: file };
    const command = new GetObjectCommand(input);
    const { Body: fileStream } = await s3Client.send(command);
    return fileStream;
  };
};
