import express from 'express';
import createComments from '../controller/comments/create.js';
const commentsRouter = express.Router();

// 댓글 달기 API
commentsRouter.post("/comment", createComments);

export default commentsRouter;
