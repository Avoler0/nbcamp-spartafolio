import express from 'express';
import emailRouter from "./src/routers/emailtest.router.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api',emailRouter);

app.get('/',(req,res)=>{
  res.send('Hello World !')
})

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});