import express from 'express';
import emailRouter from './src/routers/emailtest.router.js';
import fs from 'fs';
import profileRouter from './src/routers/profiletest.router.js';
import userRouter from './src/routers/users.router.js';
import path from 'path';
import { fileURLToPath } from 'url'; // 👈 추가
import projectRouter from './src/routers/projects.router.js';
import commentsRouter from './src/routers/comments.router.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/images', express.static(path.join(__dirname + './src/front/images')));
app.use('/html', express.static(path.join(__dirname + './src/front')));
app.use('/css', express.static(path.join(__dirname + './src/front/css')));
app.use('/script', express.static(path.join(__dirname + './src/front/js')));
app.use('/api', [
  projectRouter,
  emailRouter,
  profileRouter,
  commentsRouter,
  userRouter,
]);

app.get('/', (req, res) => {
  fs.readFile('./src/front/index.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    res.end();
  });
});

app.get('/project-regist', (req, res) => {
  fs.readFile('./src/front/project-register.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    res.end();
  });
});

app.get('/detail/:projectId', (req, res) => {
  fs.readFile('./src/front/detail.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    res.end();
  });
});

app.get('/sign-up', (req, res) => {
  fs.readFile('./src/front/sign-up.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    res.end();
  });
});

app.get('/login', (req, res) => {
  fs.readFile('./src/front/login.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    res.end();
  });
});

app.get('/sign-up', (req, res) => {
  fs.readFile('./src/front/sign-up.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    res.end();
  });
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});
