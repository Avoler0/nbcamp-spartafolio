import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET } from '../constants/security.constant.js';
import db from '../models/index.js';
const { Users } = db;

export const needSignin = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(req.headers.authorization);
  try {
    const [tokenType, accessToken] =
      req.headers.authorization !== undefined && req.headers.authorization?.split(' ');

    if (tokenType !== 'Bearer') {
      return res.status(400).json({
        success: false,
        message: '지원하지 않는 인증 방식',
      });
    }

    
    if (accessToken && !refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'accessToken이 없습니다',
      });
    }

    if (refreshToken) {
      jwt.verify(refreshToken, JWT_ACCESS_TOKEN_SECRET);

      if (accessToken) {
        const user = await Users.findOne({
          where: { refresh_token: refreshToken },
        });

        if (!user) {
          return res.status(400).json({
            success: false,
            message: 'refresh Token이 존재하지 않습니다.',
          });
        }
        
        delete user.pasword;
        res.locals.isAccessToken = false;
        res.locals.user = user.toJSON();

        next();
      }
    }

    if(accessToken){
      const decodedPayload = jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);
      const { userId } = decodedPayload;

      const user = await Users.findByPk(userId);

      // 일치 히는 userId가 없는 경우
      if (!user) {
        return res.status(400).json({
          success: false,
          message: '존재하지 않는 사용자입니다',
        });
      }

      const userData = user.toJSON();
      delete userData.pasword;
      res.locals.isAccessToken = true;
      res.locals.user = userData;

      next();
    }

  } catch (error) {
    // 검증에 실패한 경우

    console.error(error);

    let statusCode = 500;
    let errorMessage = ' ';

    // 유효기가이 지난 경우
    switch (error.message) {
      case 'jwt expired':
        statusCode = 401;
        errorMessage = '인증 정보 유효기간이 지났습니다';
        break;
      case 'invalid signature':
        statusCode = 401;
        errorMessage = '유효하지 않는 인증 정보입니다.';
        break;
      default:
        statusCode = 500;
        errorMessage =
          '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요';
        break;
    }
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};
