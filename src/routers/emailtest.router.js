
import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const emailRouter = express();

emailRouter.post('/email',async (req,res)=>{
  const { authEmail } = req.body;

  const authNumber = Math.floor(Math.random() * (10000 - 1000)) + 1000;

  if(!authEmail) return res.status(400).json({
      success: false,
      message: '요청 이메일이 없습니다.',
    })

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD
    }
  });
  const mailOptions = {
    from: 'Sparta Folio', // 발송 주체
    to: authEmail, // 인증을 요청한 이메일 주소
    subject: '[Sparta Folio] 이메일 확인 인증번호 안내', // 이메일 제목
    text: `아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n
    인증번호 6자리 👉 ${authNumber}`, // 이메일 내용
  };
  
  try{
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      success: true,
      message: '이메일 인증 요청에 성공하였습니다.',
      authNumber
    })
  }catch(err){
    res.status(500).json({
      success: false,
      message: '이메일 인증 요청에 실패하였습니다.',
    })
  }
})



export default emailRouter;