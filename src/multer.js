import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import s3Config from '../config/s3.js';


const s3 = new aws.S3({
  accessKeyId:process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: 'ap-northeast-2',
});
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'nbcamp-bukkit',
    acl:'public-read',
    contentType:multerS3.AUTO_CONTENT_TYPE,
    key:(req,file,cb)=>{
      console.log('파일',file)
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
})

export default upload;