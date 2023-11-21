import dotenv from 'dotenv';

dotenv.config();

const s3Config = {
  "accessKeyId": process.env.AWS_S3_ACCESS_KEY,
  "secretAccessKey": process.env.AWS_S3_SECRET_KEY,
  "region": "ap-northeast-2"
}

export default s3Config;