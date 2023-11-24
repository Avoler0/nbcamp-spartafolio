import express, { Router } from 'express'; // 익스프레스 라우터 객체 생성하는 거일 듯.
import db from '../../models/index.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import {
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_ACCESS_TOKEN_SECRET,
  PASSWORD_HASH_SALT_ROUNDS,
} from '../../constants/security.constant.js';

import bcrypt from 'bcrypt';

const { Users } = db;

dotenv.config();

const userRouter = express.Router();


//회원가입

userRouter.post('/users', async (req, res) => {
  try {
    const { email, name, password, passwordConfirm } = req.body;
    if (!email || !name || !password || !passwordConfirm) {
      return res.status(401).json({
        success: false,
        message: '데이터 형식이 올바르지 않아요.',
      });
    }
    const emailExp = new RegExp(
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
    );
    // 메일 형식을 검사하기 위한 정규표현식
    const emailCheck = emailExp.test(email);
    if (!emailCheck) {
      return res.status(402).send({
        // 402 : 결제 필요
        success: false,
        message: '이메일 형식이 올바르지 않음',
      });
    }

    if (password.length < 8) {
      // 비밀번호 8자리 이상
      return res.status(403).send({
        success: false,
        message: '요즘 세상에 비밀번호 8자리 이상은 해야 하는거 아닌가요',
      });
    }
    if (password !== passwordConfirm) {
      return res.status(404).json({
        //404 코드 수정하기
        success: false,
        message: '비밀번호가 비밀번호 확인란과 다를 뻔',
      });
    }
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

    //201: POST 나 PUT 으로 게시물 작성이나 회원 가입 등의 새로운 데이터를 서버에 생성하는(쓰는, 넣는) 작업이 성공했을 때 반환
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
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: '이메일 입력 해주세요.',
      });
    }

    if (!password) {
      return res.status(400).send({
        success: false,
        message: '비밀번호 입력 안 할 뻔',
      });
    }
    const userObject = await Users.findOne({ where: { email } });
    if (!userObject) {
      return res.status(404).json({
        //404 코드 : 찾을 수 없음
        success: false,
        message: '해당 이메일을 가진 사용자를 찾을 수 없습니다.',
      });
    }
    // 사용자 찾고, 사용자 없으면 에러 반환, 사용자가 존재하면 'toJSON' 메소드를 호출하여 사용자 정보를 JSON 형식으로 변환

    const user = await (await Users.findOne({ where: { email } })).toJSON();
    const hashedPassword = user?.password; //데이터베이스 안에 있는 패스워드
    const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);

    const isCorrectUser = user && isPasswordMatched;

    if (!isCorrectUser) {
      return res.status(401).json({
        success: false,
        message: '일치하는 회원 정보가 없습니다.',
      });
    }

    const accessToken = jwt.sign({ userId: user.user_id }, JWT_ACCESS_TOKEN_SECRET, {
      //액세스토큰
      expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
    });

    return res.status(200).json({
      success: true,
      message: '로그인에 성공했습니다.',
      data: { accessToken },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: '예상치 못한 에러입니다. 관리자에게 문의 주세요.',
    });
  }
});

//비밀번호 수정

// userRouter.put('/users', async (req, res) => {
//   try {
//     const { email, password, newPassword } = req.body;
//     if (!email || !password || !newPassword) {
//       return res.status(401).json({
//         success: false,
//         message: '데이터 형식이 올바르지 않음',
//       });
//     }
//     const updatedUser = await Users.findOne({ where: { email } });
//     if (updatedUser && bcrypt.compareSync(password, updatedUser.password)) {
//       await Users.update(
//         { password: bcrypt.hashSync(newPassword, PASSWORD_HASH_SALT_ROUNDS) },
//         { where: { email } },
//       );
//       return res.status(200).json({
//         success: true,
//         message: '비밀번호 변경에 성공했습니다.',
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: '이메일이나 비밀번호가 올바르지 않습니다.',
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: '예상치 못한 에러입니다. 관리자에게 문의 주세요.',
//     });
//   }
// });

// // 사용자 ID 이름 조회
// userRouter.get('/users/find', async (req, res) => {
//   try {
//     const { sort } = req.query;
//     let upperCaseSort = sort?.toUpperCase();

//     if (upperCaseSort !== 'ASC' && upperCaseSort !== 'DESC') {
//       upperCaseSort = 'DESC';
//     }

//     const userFind = await Users.findAll({
//       order: [['createdAt', upperCaseSort]],
//     });
//     return res.status(200).json({
//       success: true,
//       message: '유저 목록 조회에 성공함',
//       data: userFind,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
//     });
//   }
// });

//삭제

userRouter.delete('/users', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: '회원 형식이 올바르지 않습니다.',
      });
    }

    const deletedUser = (await Users.findOne({ where: { email } })).toJSON();
    // 이 부분은 Users라는 테이블에서 이메일이 입력된 이메일과 일치하는 사용자를 찾는 쿼리를 수행합니다.

    const hashedPassword = deletedUser?.password;
    const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);

    const isDeleteUser = deletedUser && isPasswordMatched;

    if (isDeleteUser) {
      await Users.destroy({ where: { email } });
      return res.status(200).json({
        success: true,
        message: '회원 정보 삭제에 성공했습니다.',
      });
    } else {
      res.status(402).json({
        success: false,
        message: '회원 정보가 맞지 않음',
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: '회원 삭제할 수 없음',
    });
  }
});

export default userRouter;
