import { basename, join } from 'path';

import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Errors } from '@lib/errors';

import { createIsUploaded, isFileInDir } from './lib';

export const createMoveFile = ({ config, s3Client }) => {
  const isUploaded = createIsUploaded(config);
  return async ({ bucket, file, to }) => {
    if (isFileInDir({ file, dir: to })) return;
    if (!isUploaded({ bucket, file }))
      throw new Errors.UploadStore(
        `File "s3://${bucket}/${file}" is not inside upload bucket/folder`,
      );

    try {
      const copyCommand = new CopyObjectCommand({
        Bucket: bucket,
        Key: join(to, basename(file)),
        CopySource: join(bucket, file),
      });
      await s3Client.send(copyCommand);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: file,
      });
      await s3Client.send(deleteCommand);
    } catch (error) {
      throw new Errors.UploadStore(
        `An error occurred while trying to copy a file "s3://${bucket}/${file}" to dir "${to}"`,
        error,
      );
    }
  };
};
