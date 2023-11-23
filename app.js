import express from 'express';
import emailRouter from "./src/routers/emailtest.router.js";

import profileRouter from './src/routers/profiletest.router.js';
import userRouter from './src/routers/users.router.js';
import path from 'path'
import { fileURLToPath } from "url";   // 👈 추가
import projectRouter from './src/routers/projects.router.js';
import commentsRouter from './src/routers/comments.router.js';
import frontRouter from './src/routers/front.router.js';

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/images', express.static(path.join(__dirname + './src/front/images')))
app.use('/html', express.static(path.join(__dirname + './src/front')))
app.use('/css', express.static(path.join(__dirname + './src/front/css')))
app.use('/script', express.static(path.join(__dirname + './src/front/js')))

app.use('/',frontRouter)
app.use('/api', [projectRouter, emailRouter, profileRouter, commentsRouter, userRouter]);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});