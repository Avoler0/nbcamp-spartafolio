import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
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
      if (!allowedExtensions.includes(file.mimetype.split('/')[1])) {
        cb(new Error('허용되지 않는 파일 형식입니다'));
      }

      cb(null, `${file.fieldname}/${file.originalname}-${Date.now()}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


export default upload;