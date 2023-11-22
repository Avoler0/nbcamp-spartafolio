import express, { Router } from 'express'; // 익스프레스 라우터 객체 생성하는 거일 듯.
import db from '../../models/index.js';
import dotenv from 'dotenv';
import { PASSWORD_HASH_SALT_ROUNDS } from '../../constants/security.constant.js';

import bcrypt from 'bcrypt';

const { Users } = db;

dotenv.config();

const userRouter = express.Router();

userRouter.post('/users', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(401).json({
        success: false,
        message: '데이터 형식이 올바르지 않아요.',
      });
    }
    const emailExp = new RegExp(
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
    );
    //메일 형식을 검사하기 위한 정규표현식 붙여넣기.
    const emailCheck = emailExp.test(email); //이메일체크라는 변수 줘서 사용자가 입력한 이메일이 정규표현식에 맞는 형식인지 테스트
    if (!emailCheck) {
      // 이메일체크 해봤는데
      return res.status(402).send({
        // 402 : 결제 필요
        success: false,
        message: '이메일 형식이 올바르지 않음',
      }); //이메일 형식이 잘못되었다면 상태코드, 에러 메시지를 보냄
    }

    if (password.length < 8) {
      // 비밀번호 8자리 이상
      return res.status(403).send({
        success: false,
        message: '요즘 세상에 비밀번호 8자리 이상은 해야 하는거 아닌가요',
      });
    } // 비밀번호 검사 나중에 넣기

    const existsUserEmail = await Users.findOne({ where: { email } });
    if (existsUserEmail) {
      return res.status(405).json({
        success: false,
        message: '이미 가입 된 이메일',
      });
    }

    const hashedPassword = bcrypt.hashSync(password, PASSWORD_HASH_SALT_ROUNDS);

    const newUser = await Users.create({
      email,
      name,
      password: hashedPassword,
    });
    delete newUser.password;

    return res.status(201).json({
      success: true,
      message: '회원가입에 성공하셨습니다.!',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: '예상치 못한 에러입니다. 관리자에게 문의 주세요.',
    });
  }
});

//로그인

userRouter.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  const bcryptPw = bcrypt(password);

  try {
    const loginInfo = await Users.findOne({ where: { email, password } });
    if (!result) {
      return res.status(401).json({
        success: false,
        message: '이메일 or 비밀번호 잘못 되었습니다.',
      });
    }

    if (result.password === bcryptPw) {
      let expires = new Date();
      expires.setMinutes(expires.getMinutes() + 60 * 12); //만료시간 12시간으로 설정

      const token = jwt.sign({ eamil, name: loginInfo.name }, 'secret-key');
      res.cookie();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: '예상치 못한 에러입니다. 관리자에게 문의 주세요.',
    });
  }
});

//수정

//삭제

export default userRouter;
