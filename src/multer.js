import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import {
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_ACCESS_TOKEN_SECRET,
  PASSWORD_HASH_SALT_ROUNDS,
} from '../constants/security.constant.js';
import jwt from 'jsonwebtoken';
const allowedExtensions = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: 'ap-northeast-2',
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'nbcamp-bukkit',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      console.log(file);
      cb(null, `${file.fieldname}/${file.originalname}`);
      // const { authorization } = req.headers;

      // if (!allowedExtensions.includes(file.mimetype.split('/')[1])) {
      //   cb(new Error('허용되지 않는 파일 형식입니다'));
      // }
      // // return cb(null, `${file.fieldname}/${file.originalname}`);
      // if (file.fieldname === 'additional') {
      //   const { projectTitle } = req.body;
      //   const accessToken = authorization.split(' ')[1];
      //   const payloadToken = jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);

      //   cb(null, `${file.fieldname}/${file.originalname}`);
      //   // return cb(
      //   //   null,
      //   //   `${file.fieldname}/${payloadToken.userId}-${projectTitle}/${file.originalname}`,
      //   // );
      // } else {
      //   cb(null, `${file.fieldname}/${file.originalname}`);
      // }
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});


export default upload;