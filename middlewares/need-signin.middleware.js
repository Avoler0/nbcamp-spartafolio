import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET } from '../constants/security.constant.js';
import db from '../models/index.js';
const { Users } = db;

export const needSignin = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  function userValid(user) {
    if (user) {
      const userData = user.toJSON();
      delete userData.password;

      res.locals.user = userData;
    } else {
      return res.status(400).json({
        success: false,
        message: '유저 데이터를 찾을 수 없습니다.',
      });
    }
  }

  try {
    if(!req.headers.authorization){
      return res.status(400).json({
        success: false,
        message: 'Authorization Header가 없습니다.',
      });
    }

    const [tokenType, accessToken] = req.headers.authorization?.split(' ');

    if (tokenType !== 'Bearer') {
      console.log('배어러 400 에러');
      return res.status(400).json({
        success: false,
        message: '지원하지 않는 인증 방식',
      });
    }

    if (!accessToken && !refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'accessToken과 refreshToken 둘 다 없습니다',
      });
    }

    if (accessToken && !refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'refreshToken 이 없습니다',
      });
    }

    if(!accessToken && refreshToken){
      jwt.verify(refreshToken, JWT_ACCESS_TOKEN_SECRET);

      const user = await Users.findOne({
        where: { refresh_token: refreshToken },
      });

      userValid(user);

      return next();
    }

    if(accessToken && refreshToken){
      const decodedPayload = jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);
      const { userId } = decodedPayload;

      const user = await Users.findByPk(userId);

      userValid(user);

      return next();
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
        errorMessage = '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요';
        break;
    }
    
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};
