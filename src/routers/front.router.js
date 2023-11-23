import express from 'express';
import fs from 'fs'
const frontRouter = express.Router();

frontRouter.get('/', (req, res) => {
  fs.readFile('./src/front/index.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    res.end();
  });
})

frontRouter.get('/project-regist', (req, res) => {
  fs.readFile('./src/front/project-register.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    res.end();
  });
})

frontRouter.get('/sign-up', (req, res) => {
  fs.readFile('./src/front/sign-up.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    res.end();
  });
})

export default frontRouter;