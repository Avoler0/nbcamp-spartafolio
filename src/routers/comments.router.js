import express from 'express';
import createComments from '../controller/comments/create.js';
import readComments from '../controller/comments/read.js';
const commentsRouter = express.Router();

// 댓글 달기 API
commentsRouter.post("/comment", createComments);

// 댓글 가져오기 API
commentsRouter.get('/:projectId/comments', readComments);

export default commentsRouter;
