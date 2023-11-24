import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import {
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_ACCESS_TOKEN_SECRET,
  PASSWORD_HASH_SALT_ROUNDS,
} from '../constants/security.constant.js';
import jwt from 'jsonwebtoken';
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];

const s3 = new aws.S3({
  accessKeyId:process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: 'ap-northeast-2',
});

const upload = multer({
  storage: multerS3({
    s3:s3,
    bucket: 'nbcamp-bukkit',
    acl:'public-read',
    contentType:multerS3.AUTO_CONTENT_TYPE,
    key:(req,file,cb)=>{
      const { projectTitle } = req.body;
      const { authorization } = req.headers;
      
      try{
        // const accessToken = authorization.split(" ")[1];
        // const payloadToken = jwt.verify(accessToken, 1); 
        // console.log('파일', payloadToken,req.body);
        // console.log()
        cb(null, `${file.fieldname}/${file.originalname}`) // 유저 아이디 또는 이메일로 구분 짓기
      }catch(err){
        // req.locals.user = "multer error"
      }
    }
  })
})

export default upload;