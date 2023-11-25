import express from 'express';

import { needSignin } from '../../middlewares/need-signin.middleware.js'
import { Op } from 'sequelize';

import db from '../../models/index.js';
const { Comments, Users, Projects } = db;

const commentsRouter = express.Router();

// 댓글 달기 API
commentsRouter.post("/comment/:detailProjectId", needSignin, async (req, res) => {
  try {
    const { contents } = req.body;
    const { detailProjectId } = req.params;
    const { user_id } = res.locals.user;

    if (!contents) {
      return res.status(400).json({ success: false, message: "댓글을 입력해주세요" });
    };

    const existingProject = await Projects.findByPk(detailProjectId);
    const existingUser = await Users.findByPk(user_id);

    if (!existingProject) {
      return res.status(404).json({ success: "false", message: "해당하는 프로젝트를 찾을 수 없습니다." })
    }

    if (!existingUser) {
      return res.status(404).json({ success: false, message: "해당하는 유저를 찾을 수 없습니다." })
    };

    await Comments.create({
      project_id: existingProject.project_id,
      contents,
      user_id: existingUser.user_id
    });

    res.status(201).json({ success: true, message: "댓글이 입력되었습니다." });
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "알 수 없는 오류가 발생하였습니다." });
  }
});

// 댓글 가져오기 API
commentsRouter.get('/:projectId/comments', async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log('projectId: ', projectId);

    const comments = await Comments.findAll({
      where: {
        project_id: projectId, // 특정 project에 있는 댓글들을 다 가져온다 !
      },
    });

    res.status(200).json({ success: false, message: "댓글 조회에 성공했습니다.", comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '알 수 없는 오류가 발생하였습니다.' });
  }
});

// 댓글 수정하기
commentsRouter.put('/comment/:commentId', needSignin, async (req, res) => {
  try {
    const { commentId } = req.params
    const { contents } = req.body;
    const { user_id } = res.locals.user;

    const existingComment = await Comments.findOne({ where: { comment_id: commentId } });

    // 해당하는 댓글이 없을 경우
    if (!existingComment) {
      return res.status(404).json({ success: false, message: "해당하는 댓글이 없습니다." });
    };

    // 본인이 작성한 댓글이 아닐 경우
    if (existingComment.user_id !== user_id) {
      return res.status(403).json({ success: false, message: "댓글 수정 권한이 없습니다." });
    }

    await Comments.update(
      { contents },
      {
        where: {
          [Op.and]: [{ comment_id: commentId }, { user_id }]
        }
      }
    );

    res.status(200).json({ success: true, message: "댓글 수정에 성공했습니다." })
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "알 수 없는 오류가 발생했습니다." })
  };
});

// 댓글 삭제하기
commentsRouter.delete('/comment/:commentId', needSignin, async (req, res) => {
  try {
    const { commentId } = req.params
    const { user_id } = res.locals.user;

    const existingComment = await Comments.findOne({ where: { comment_id: commentId } });

    // 해당하는 댓글이 없을 경우
    if (!existingComment) {
      return res.status(404).json({ success: false, message: "해당하는 댓글이 없습니다." });
    };

    // 본인이 작성한 댓글이 아닐 경우 

    if (existingComment.user_id !== user_id) {
      return res.status(403).json({ success: false, message: "댓글 삭제 권한이 없습니다." });
    }

    await Comments.destroy(
      {
        where: {
          [Op.and]: [{ comment_id: commentId }, { user_id }]
        }
      }
    );
    res.status(200).json({ success: true, message: "댓글 삭제에 성공했습니다." })
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "알 수 없는 오류가 발생했습니다." })
  };
});

export default commentsRouter;
