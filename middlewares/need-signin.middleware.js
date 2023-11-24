import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET } from '../constants/security.constant.js';
import db from '../models/index.js';
const { Users } = db;

export const needSignin = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        console.log("이게 계속?", authorizationHeader);
        // 인증 정보가 아예 없는 경우
        if (!authorizationHeader) {
            return res.status(400).json({
                success: false,
                message: "에러 발생"
            });
        }
        // req.headers.authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDA3OTczMDMsImV4cCI6MTcwMDg0MDUwM30.izvlsQJqob7ArF2-JNyVxwBBsDTQOJHK0rpoqc2Y37Y"
        // req.headers.authorization?.split(' ') = ["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDA3OTczMDMsImV4cCI6MTcwMDg0MDUwM30.izvlsQJqob7ArF2-JNyVxwBBsDTQOJHK0rpoqc2Y37Y"]
        const [tokenType, accessToken] = req.headers.authorization?.split(' ');
        console.log("어디서 오류 1?")

        // 토큰 형식이 일치하지 않은 경우
        if (tokenType !== 'Bearer') {
            return res.status(400).json({
                success: false,
                message: "지원하지 않는 인증 방식"
            });
        }

        if (!accessToken) {
            return res.status(400).json({
                success: false,
                message: "accessToken이 없습니다"
            });
        }

        const decodedPayload = jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);
        const { userId } = decodedPayload;
        // console.log(decodedPayload);
        console.log("식별", accessToken);
        // 일치 히는 userId가 없는 경우
        const user = await Users.findByPk(userId);
        // console.log(user);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "존재하지 않는 사용자입니다"
            });
        }

        const userData = user.toJSON();
        delete userData.pasword;
        res.locals.user = userData;

        next();
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