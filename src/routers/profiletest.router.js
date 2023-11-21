
import express from 'express';
import dotenv from 'dotenv';
import upload from '../multer.js';
dotenv.config();

const profileRouter = express.Router();

profileRouter.post('/profile',upload.single('image'), (req, res) => {
   console.log(req.file);
   res.json({ url: req.file });
});

export default profileRouter;