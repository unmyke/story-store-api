jest.mock('@aws-sdk/s3-request-presigner');

import { Readable } from 'stream';

import 'aws-sdk-client-mock-jest';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { ErrorTypes } from '@lib/errors';

import { createUploadStore } from './create-upload-store';

const s3ClientMock = mockClient(S3Client);

describe('# @lib/create-upload-store', () => {
  beforeEach(() => {
    getSignedUrl.mockReset();
    s3ClientMock.reset();
  });

  const config = {
    bucket: 'bucket',
    region: 'region',
    dirs: { uploaded: 'uploaded', parsed: 'parsed' },
  };
  const uploadStore = createUploadStore(config);

  it('should return upload store', () => {
    expect(uploadStore).toStrictEqual({
      getSignedUrl: expect.any(Function),
      getFileStream: expect.any(Function),
      moveFile: expect.any(Function),
    });
  });

  describe('## getSignedUrl', () => {
    const uploadStore = createUploadStore(config);
    describe('when passed valid file name', () => {
      it('should return upload signed url', async () => {
        const expectedSignedUrl = 'signed-url';
        getSignedUrl.mockResolvedValue(expectedSignedUrl);
        const signedUrl = await uploadStore.getSignedUrl('file');
        expect(getSignedUrl).toHaveBeenCalledTimes(1);
        expect(signedUrl).toBe(expectedSignedUrl);
      });
    });

    describe('when passed invalid file name', () => {
      it('should throw error', async () => {
        const expectedError = new Error('s3 error');
        getSignedUrl.mockRejectedValue(expectedError);
        await expect(uploadStore.getSignedUrl('file')).rejects.toThrow({
          message: 'Fail to get singed error for "file" file',
          type: ErrorTypes.UPLOAD_STOREname,
          cause: expectedError,
        });
        expect(getSignedUrl).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('## getFileStream', () => {
    describe('when file exists', () => {
      it('should return file steam', async () => {
        const expectedFile = 'fileSteam';
        const uploadedFileSteam = Readable.from(expectedFile);
        s3ClientMock.on(GetObjectCommand).resolves({ Body: uploadedFileSteam });
        const fileStream = await uploadStore.getFileStream({
          bucket: config.bucket,
          file: `${config.dirs.uploaded}/file`,
        });
        expect(s3ClientMock).toHaveReceivedCommandTimes(GetObjectCommand, 1);
        expect(s3ClientMock).toHaveReceivedCommandWith(GetObjectCommand, {
          Bucket: config.bucket,
          Key: `${config.dirs.uploaded}/file`,
        });
        for await (const uploadedFile of fileStream) {
          expect(uploadedFile).toBe(expectedFile);
        }
      });
    });

    describe('when file created:', () => {
      describe('- in the another bucket', () => {
        it('should throw error', async () => {
          const bucket = 'another-bucket';
          const file = `${config.dirs.uploaded}/file`;
          await expect(
            uploadStore.getFileStream({ bucket, file }),
          ).rejects.toThrow({
            message: `File "s3://${bucket}/${file}" is not inside upload bucket/folder`,
            type: ErrorTypes.UPLOAD_STORE.type,
          });
        });
      });

      describe('- outside upload directory', () => {
        it('should throw error', async () => {
          const bucket = config.bucket;
          const file = `outside/file`;
          await expect(
            uploadStore.getFileStream({ bucket, file }),
          ).rejects.toThrow({
            message: `File "s3://${bucket}/${file}" is not inside upload bucket/folder`,
            type: ErrorTypes.UPLOAD_STORE.type,
          });
        });
      });
    });
  });

  describe('## moveFile', () => {
    describe('when file exists', () => {
      beforeEach(() => {
        s3ClientMock.on(CopyObjectCommand).resolves();
        s3ClientMock.on(DeleteObjectCommand).resolves();
      });

      describe('when file located inside upload bucket and directory', () => {
        describe('when move the file to another directory', () => {
          it('should resoloves', async () => {
            await expect(
              uploadStore.moveFile({
                bucket: config.bucket,
                file: `${config.dirs.uploaded}/file`,
                to: 'dir',
              }),
            ).resolves.toBeUndefined();
          });

          it('should call CopyObjectCommand and DeleteObjectCommand', async () => {
            await uploadStore.moveFile({
              bucket: config.bucket,
              file: `${config.dirs.uploaded}/file`,
              to: 'dir',
            });
            expect(s3ClientMock).toHaveReceivedCommandTimes(
              CopyObjectCommand,
              1,
            );
            expect(s3ClientMock).toHaveReceivedCommandWith(CopyObjectCommand, {
              Bucket: config.bucket,
              Key: 'dir/file',
              CopySource: 'bucket/uploaded/file',
            });
            expect(s3ClientMock).toHaveReceivedCommandTimes(
              DeleteObjectCommand,
              1,
            );
            expect(s3ClientMock).toHaveReceivedCommandWith(
              DeleteObjectCommand,
              {
                Bucket: config.bucket,
                Key: `${config.dirs.uploaded}/file`,
              },
            );
          });
        });

        describe('when move file to same directory', () => {
          it('should resoloves', async () => {
            await expect(
              uploadStore.moveFile({
                bucket: config.bucket,
                file: `${config.dirs.uploaded}/file`,
                to: config.dirs.uploaded,
              }),
            ).resolves.toBeUndefined();
          });

          it('should not call CopyObjectCommand and DeleteObjectCommand', async () => {
            await uploadStore.moveFile({
              bucket: config.bucket,
              file: `${config.dirs.uploaded}/file`,
              to: config.dirs.uploaded,
            });
            expect(s3ClientMock).not.toHaveReceivedCommand(CopyObjectCommand);
            expect(s3ClientMock).not.toHaveReceivedCommand(DeleteObjectCommand);
          });
        });
      });

      describe('when file located outside upload:', () => {
        describe('- bucket', () => {
          it('should rejects', async () => {
            await expect(
              uploadStore.moveFile({
                bucket: 'outside-bucket',
                file: `${config.dirs.uploaded}/file`,
                to: 'dir',
              }),
            ).rejects.toThrow({
              message: `File "s3://outside-bucket/${config.dirs.uploaded}/file" is not inside upload bucket/folder`,
              type: ErrorTypes.UPLOAD_STORE.type,
            });
          });

          it('should not call CopyObjectCommand and DeleteObjectCommand', async () => {
            await uploadStore
              .moveFile({
                bucket: 'outside-bucket',
                file: `${config.dirs.uploaded}/file`,
                to: 'dir',
              })
              .catch(() => {});
            expect(s3ClientMock).not.toHaveReceivedCommand(CopyObjectCommand);
            expect(s3ClientMock).not.toHaveReceivedCommand(DeleteObjectCommand);
          });
        });

        describe('- directory', () => {
          it('should rejects', async () => {
            await expect(
              uploadStore.moveFile({
                bucket: config.bucket,
                file: `outside/file`,
                to: 'dir',
              }),
            ).rejects.toThrow({
              message: `File "s3://${config.bucket}/outside/file" is not inside upload bucket/folder`,
              type: ErrorTypes.UPLOAD_STORE.type,
            });
          });

          it('should not call CopyObjectCommand and DeleteObjectCommand', async () => {
            await uploadStore
              .moveFile({
                bucket: config.bucket,
                file: `outside/file`,
                to: 'dir',
              })
              .catch(() => {});
            expect(s3ClientMock).not.toHaveReceivedCommand(CopyObjectCommand);
            expect(s3ClientMock).not.toHaveReceivedCommand(DeleteObjectCommand);
          });
        });
      });
    });

    describe('when copy file rejects', () => {
      const s3CopyError = new Error('s3 copy error');
      beforeEach(() => {
        s3ClientMock.on(CopyObjectCommand).rejects(s3CopyError);
        s3ClientMock.on(DeleteObjectCommand).resolves();
      });

      it('should rejects', async () => {
        await expect(
          uploadStore.moveFile({
            bucket: config.bucket,
            file: `${config.dirs.uploaded}/file`,
            to: 'dir',
          }),
        ).rejects.toThrow({
          message: `An error occurred while trying to copy a file "s3://${config.bucket}/${config.dirs.uploaded}/file" to dir "dir"`,
          type: ErrorTypes.UPLOAD_STORE.type,
          cause: s3CopyError,
        });
      });

      it('should not call DeleteObjectCommand', async () => {
        await uploadStore
          .moveFile({
            bucket: 'outside-bucket',
            file: `${config.dirs.uploaded}/file`,
            to: 'dir',
          })
          .catch(() => {});
        expect(s3ClientMock).not.toHaveReceivedCommand(DeleteObjectCommand);
      });
    });
  });
});
