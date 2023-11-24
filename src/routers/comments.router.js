import express from 'express';
import readComments from '../controller/comments/read.js'; // 댓글 가져오기 API
import updateComment from '../controller/comments/update.js'; // 댓글 수정 API
import deleteComment from '../controller/comments/delete.js'; // 댓글 삭제 API

import { needSignin } from '../../middlewares/need-signin.middleware.js'

import db from '../../models/index.js';
const { Comments, Users, Projects } = db;

const commentsRouter = express.Router();

// 댓글 달기 API
commentsRouter.post("/comment/:detailProjectId", needSignin, async (req, res) => {
  try {
    const { contents } = req.body;
    const { detailProjectId } = req.params;
    const { userId } = res.locals.user;
    console.log('res.locals.user: ', res.locals.user);

    if (!contents) {
      return res.status(400).json({ message: "댓글을 입력해주세요" });
    };

    const existingProject = await Projects.findByPk(detailProjectId);
    const existingUser = await Users.findByPk(userId);

    if (!existingUser) {
      return res.status(404).json({ message: "해당하는 프로젝트를 찾을 수 없습니다." })
    };

    await Comments.create({
      project_id: existingProject.project_id,
      contents,
      user_id: existingUser.user_id
    });

    res.status(201).json({ message: "댓글이 입력되었습니다." });
  } catch (error) {
    console.error(error)
    res.status(500).send("알 수 없는 오류가 발생하였습니다.");
  }
});

// 댓글 가져오기 API
commentsRouter.get('/:projectId/comments', readComments);

// 댓글 수정하기
commentsRouter.put('/comment/:commentId', updateComment, deleteComment);

// 댓글 삭제하기
commentsRouter.delete('/comment/:commentId', deleteComment);

export default commentsRouter;
