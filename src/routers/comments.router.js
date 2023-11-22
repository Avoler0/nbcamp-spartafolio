import express from 'express';
import createComments from '../controller/comments/create.js';
import readComments from '../controller/comments/read.js';
import updateComment from '../controller/comments/update.js';
const commentsRouter = express.Router();

// 댓글 달기 API
commentsRouter.post("/comment", createComments);

// 댓글 가져오기 API
commentsRouter.get('/:projectId/comments', readComments);

// 댓글 수정하기 API
commentsRouter.put('/comment/:commentId', updateComment)

export default commentsRouter;
