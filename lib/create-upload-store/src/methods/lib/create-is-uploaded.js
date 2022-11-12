import { parse } from 'path';

export const createIsUploaded =
  ({ bucket: uploadBucket, dirs: { uploaded: uploadDir } }) =>
  ({ bucket, file }) =>
    bucket === uploadBucket && parse(file).dir === uploadDir;
