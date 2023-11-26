import express from 'express';
import emailRouter from './src/routers/emailtest.router.js';
import userRouter from './src/routers/users.router.js';
import path from 'path';
import { fileURLToPath } from 'url'; // 👈 추가
import projectRouter from './src/routers/projects.router.js';
import commentsRouter from './src/routers/comments.router.js';
import 'dotenv/config';//
import {needSignin} from './middlewares/need-signin.middleware.js'
import cookieParser from 'cookie-parser';
console.log("needSignin", needSignin);

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('port', process.env.PORT);
app.use(express.static(path.join(__dirname, 'src', 'front')));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/api', [
  projectRouter,
  emailRouter,
  commentsRouter,
  userRouter,
]);

app.get('/js/index.js', (req, res) => {
  res.sendFile(__dirname + './src/front/js');
});

app.get('/', (req, res) => {
  res.render(path.join(__dirname, 'src', 'front', 'index'));
});

app.get('/project-regist', (req, res) => {
  res.render(path.join(__dirname, 'src', 'front', 'project-regist'));
});

app.get('/detail/:projectId', (req, res) => {
  res.render(path.join(__dirname, 'src', 'front', 'detail'));
});

app.get('/sign-up', (req, res) => {
  res.render(path.join(__dirname, 'src', 'front', 'sign-up'));
});

app.get('/login', (req, res) => {
  res.render(path.join(__dirname, 'src', 'front', 'login'));
});

app.get('/profile', (req, res) => {
  res.render(path.join(__dirname, 'src', 'front', 'profile'));
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
