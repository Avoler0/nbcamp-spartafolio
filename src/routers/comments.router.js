import express from 'express';
import readComments from '../controller/comments/read.js'; // 댓글 가져오기 API
import updateComment from '../controller/comments/update.js'; // 댓글 수정 API
import deleteComment from '../controller/comments/delete.js'; // 댓글 삭제 API

import db from '../../models/index.js';
const { Comments, Users, Projects } = db;

const commentsRouter = express.Router();

// 댓글 달기 API
commentsRouter.post("/comment/:detailProjectId", async (req, res) => {
  try {
    const { contents } = req.body;
    const { detailProjectId } = req.params;

    if (!contents) {
      return res.status(400).json({ message: "댓글을 입력해주세요" });
    };

    const existingProject = await Projects.findByPk(1);
    const existingUser = await Users.findByPk(1);

    await Comments.create({
      project_id: detailProjectId,
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
