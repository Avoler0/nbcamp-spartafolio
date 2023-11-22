import express from 'express';
import emailRouter from "./src/routers/emailtest.router.js";
import fs from 'fs'
import profileRouter from './src/routers/profiletest.router.js';
import projectRouter from './src/routers/projects.router.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', [ projectRouter]);

app.get('/', (req, res) => {
  fs.readFile('index.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(data);
    res.end();
  });
})

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});