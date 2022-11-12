import { join } from 'path';

import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Errors } from '@lib/errors';

export const createGetSignedUrl =
  ({ config, s3Client }) =>
  async (file) => {
    const params = {
      Bucket: config.bucket,
      Key: join(config.dirs.uploaded, file),
    };
    const command = new PutObjectCommand(params);
    return getS3SignedUrl(s3Client, command, {
      expiresIn: 3600,
    }).catch((error) => {
      throw new Errors.UploadStore(
        `Fail to get singed error for "${file}" file`,
        error,
      );
    });
  };
