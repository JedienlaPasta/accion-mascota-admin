import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

const config: S3ClientConfig = { forcePathStyle: true };

if (process.env.S3_ENDPOINT) {
  config.endpoint = process.env.S3_ENDPOINT;
}

if (process.env.S3_REGION) {
  config.region = process.env.S3_REGION;
}

if (process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
  config.credentials = {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  };
}

export const s3Client = new S3Client(config);
