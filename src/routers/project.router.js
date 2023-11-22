import express from 'express';
import dotenv from 'dotenv';
import db from '../../models/index.js';

const {Projects} = db


dotenv.config();

const projectRouter = express();


projectRouter.post('/project',async (req,res)=>{
  
  try{
    await Projects.create({title:'제목'})
    
    res.status(200).send('성공')
  }catch(err){
    console.log(err)
    res.status(500).send('실패')
  }

})

export default projectRouter;