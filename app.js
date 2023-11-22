import express from 'express';
import emailRouter from "./src/routers/emailtest.router.js";
import fs from 'fs'
import profileRouter from './src/routers/profiletest.router.js';
import path from 'path'
import { fileURLToPath } from "url";   // 👈 추가
import projectRouter from './src/routers/project.router.js';

const __dirname = fileURLToPath(new URL(".", import.meta.url)); 
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/images',express.static(path.join(__dirname + './src/front/images')))
app.use('/html',express.static(path.join(__dirname + './src/front')))
app.use('/css',express.static(path.join(__dirname + './src/front/css')))
app.use('/script',express.static(path.join(__dirname + './src/front/js')))
app.use('/api',[projectRouter,emailRouter,profileRouter]);



app.get('/',(req,res)=>{
  fs.readFile('./src/front/index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write(data);
    res.end();
  });
})

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});