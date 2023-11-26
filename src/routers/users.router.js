import express from 'express';
import db from '../../models/index.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { needSignin } from '../../middlewares/need-signin.middleware.js';
import {
  // JWT_ACCESS_TOKEN_EXPIRES_IN,
  PASSWORD_HASH_SALT_ROUNDS,
  JWT_ACCESS_TOKEN_SECRET,
} from '../../constants/security.constant.js';

import bcrypt from 'bcrypt';

const { Users } = db;

dotenv.config();

const userRouter = express.Router();

userRouter.post('/user/email-check', async(req, res)=>{
  const { email } = req.body;

  const authNumber = Math.floor(Math.random() * (10000 - 1000)) + 1000;

  if (!email)
    return res.status(400).json({
      success: false,
      message: '요청 이메일이 없습니다.',
    });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Sparta Folio', // 발송 주체
    to: email, // 인증을 요청한 이메일 주소
    subject: '[Sparta Folio] 이메일 확인 인증번호 안내', // 이메일 제목
    text: `아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n
    인증번호 4자리 👉 ${authNumber}`, // 이메일 내용
  };

  try {
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: '이메일 인증 요청에 성공하였습니다.',
      authNumber,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '이메일 인증 요청에 실패하였습니다.',
    });
  }
});
//리프레쉬 쿠키 삭제
userRouter.get('/user/log-out', (req, res)=>{
  res.clearCookie('refreshToken')
  res.status(200).json({
    success: true,
    message: 'refreshToken 쿠키 삭제에 성공하였습니다.'
  });
});

userRouter.post('/user/refreshToken', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log('토큰 로그인!!', req.cookies);
  if (!refreshToken)
    return res
      .status(204)
      .json({ message: 'refreshToken이 없습니다.', success: false });

  try {
    jwt.verify(refreshToken, JWT_ACCESS_TOKEN_SECRET);

    const user = await Users.findOne({
      where: { refresh_token: refreshToken },
    });
    const accessToken = jwt.sign(
      { userId: user.user_id },
      JWT_ACCESS_TOKEN_SECRET,
      {
        //액세스토큰
        expiresIn: '30m',
      },
    );

    res.status(201).json({
      message: '새로운 Access Token이 발급 되었습니다.',
      success: true,
      accessToken,
    });
  } catch (err) {
    res.status(500).json({
      message: '변형된 refresh Token 입니다.',
      success: false,
    });
  }

  console.log(req.cookies);
});

//내 정보 변경
userRouter.put('/user', needSignin, async (req, res) => {
  try {
    const { user_id } = res.locals.user; // res.locals.user 안에 Password가 없어
    const { email, name, existPassword, toChangePassword } = req.body; // 이메일 수정은 못하게 하는게 맞을 듯합니다. 

    const currentUser = await Users.findOne({ where: { user_id } }); // res.locals.user = 현재 로그인된 유저 정보를 가져온다.

    // 유저가 존재하지 않을 경우
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "유저가 존재하지 않습니다." });
    };

    // 입력된 이메일이 기존 회원의 이메일과 다르거나 비밀번호가 다를 경우
    if (email !== currentUser.email || !await bcrypt.compare(existPassword, currentUser.password)) {
      return res.status(403).json({ success: false, message: "이메일 또는 비밀번호를 확인해주세요." });
    }

    // 변경할 비밀번호를 8자리 미만으로 입력했을 때
    if (toChangePassword.length < 8) {
      return res.status(400).json({ success: false, message: "변경할 비밀번호는 8자리 이상 입력하셔야 합니다." });
    }

    // 기존 비밀번호와 동일한 비밀번호를 입력했을 때
    if (toChangePassword === currentUser.password) {
      return res.status(400).json({ success: false, message: "동일한 비밀번호는 입력할 수 없습니다." });
    };

    //유효성 검사 모두 통과 시 
    const hashedNewPassword = await bcrypt.hash(toChangePassword, 10);
    const checkedName = !name ? currentUser.name : name;

    const updatedUser = await Users.update(
      {
        name: checkedName,
        password: hashedNewPassword
      },
      { where: { user_id } }
    );
    return res.status(200).json({ success: true, message: "유저 정보를 변경했습니다.", updatedUser });

      const hashedNewPassword = await bcrypt.hash(
        newPassword,
        PASSWORD_HASH_SALT_ROUNDS,
      );
      updateFields.password = hashedNewPassword;
    } // 사용자가 제공한 새 비밀번호를 해싱
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "알 수 없는 오류가 발생하였습니다." });
  };
});

// ==============================

// userRouter.put('/user', needSignin, async (req, res) => { 
//   const user = res.locals.user;
//   console.log(req.body);
//   const { email, name, existPassword, newPassword } = req.body;

//   try {
//     //let으로 필드를 담을 빈 객체 생성하기
//     let updateFields = {};

//     //만약에 이메일,이름 썼으면 빈 객체 안에 넣기
//     if (email) {
//       updateFields.email = email;
//     }
//     if (name) {
//       updateFields.name = name;
//     }

//     // 비밀번호
//     if (existPassword && newPassword) {
//       // const hashedExistPassword = await bcrypt.hash(existPassword, 10);
//       const userData = await Users.findByPk(user.user_id);
//       //기존,새 비번 모두 입력하면 비밀번호 해싱함

//       if (!userData) {
//         throw new Error('not found user');
//       } // 사용자 정보 못 찾을 때

//       if (!(await bcrypt.compare(existPassword, userData.password))) {
//         throw new Error('not match password');
//       } // 기존 비번, DB에 저장된 비번 동일 한 지

//       const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//       updateFields.password = hashedNewPassword;
//     } // 사용자가 제공한 새 비밀번호를 해싱

//     const result = await Users.update(updateFields, {
//       where: { user_id: user.user_id },
//     }); //

//     if (!result) {
//       throw new Error('update failed');
//     }

//     const accessToken = jwt.sign(
//       { userId: user.user_id },
//       JWT_ACCESS_TOKEN_SECRET,
//       { expiresIn: '30m' },
//     );
//     res.status(200).json({
//       success: true,
//       message: '프로필 수정이 완료 되었습니다.',
//       data: accessToken,
//     });
//   } catch (err) {
//     let statusCode;
//     let errMessage;

//     switch (err.message) {
//       case 'not match password':
//         statusCode = 400;
//         errMessage = '기존 비밀번호와 같지 않습니다.';
//         break;
//       case 'not found user':
//         statusCode = 400;
//         errMessage = '유저 데이터를 찾을 수 없습니다.';
//         break;
//       case 'update failed':
//         statusCode = 500;
//         errMessage = '업데이트에 실패했습니다.';
//         break;
//       default:
//         statusCode = 500;
//         errMessage = '서버에러';
//     }

//     return res.status(statusCode).json({
//       success: false,
//       message: errMessage,
//     });
//   }
// });



// 댓글 comments.js에서 사용합니다..ㅠㅠ (by.junsik)
userRouter.get('/user', needSignin, async (req, res) => {
  const user = res.locals.user;

  if (user) {
    return res.status(200).json({
      success: true,
      message: '사용자 데이터를 불러왔습니다.',
      data: user,
    });
  } else {
    return res.status(200).json({
      success: false,
      message: '사용자 데이터를 불러오는데 실패하였습니다.',
    });
  }
});

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
    const hashedPassword = bcrypt.hashSync(password, 10);

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
    // console.log(req.body);
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
    const refreshToken = jwt.sign({}, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: '3d',
    });

    await Users.update(
      { refresh_token: refreshToken },
      {
        where: { email },
      },
    );

    console.log('리프레쉬', refreshToken);
    const accessToken = jwt.sign(
      { userId: user.user_id },
      JWT_ACCESS_TOKEN_SECRET,
      {
        //액세스토큰
        expiresIn: '30m',
      },
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
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
