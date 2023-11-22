import express from "express";

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

app.get('/',(req,res)=>{
  res.send('Hello World !')
})

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});