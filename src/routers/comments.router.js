import express from 'express';
import createComments from '../controller/comments/create.js'; // 댓글 추가 API
import readComments from '../controller/comments/read.js'; // 댓글 가져오기 API
import updateComment from '../controller/comments/update.js'; // 댓글 수정 API
import deleteComment from '../controller/comments/delete.js'; // 댓글 삭제 API

const commentsRouter = express.Router();

// 댓글 달기 API
commentsRouter.post("/comment", createComments);

// 댓글 가져오기 API
commentsRouter.get('/:projectId/comments', readComments);

// 댓글 수정하기
commentsRouter.put('/comment/:commentId', updateComment, deleteComment);

// 댓글 삭제하기
commentsRouter.delete('/comment/:commentId', deleteComment);

export default commentsRouter;
