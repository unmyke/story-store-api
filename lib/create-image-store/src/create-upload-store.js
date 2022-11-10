import { S3Client } from '@aws-sdk/client-s3';

import {
  createGetSignedUrl,
  createGetFileStream,
  createMoveFile,
} from './methods';

export const createUploadStore = (config) => {
  const s3Client = new S3Client({ region: config.region });

  const getSignedUrl = createGetSignedUrl({ config, s3Client });
  const getFileStream = createGetFileStream({ config, s3Client });
  const moveFile = createMoveFile({ config, s3Client });

  return { getSignedUrl, getFileStream, moveFile };
};
