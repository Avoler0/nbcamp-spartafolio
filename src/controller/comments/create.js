import express from 'express';
import db from '../../../models/index.js';
const { Comments, Users, Projects } = db;

const router = express.Router();

// 댓글 달기 (Create)
const createComments = async (req, res) => {
  const { contents } = req.body;

  if (!contents) {
    return res.status(400).json({ message: "댓글을 입력해주세요" });
  };

  const existingProject = await Projects.findByPk(1);
  const existingUser = await Users.findByPk(2);


  await Comments.create({
    project_id: existingProject.project_id,
    contents,
    user_id: existingUser.user_id
  });

  res.status(201).json({ message: "댓글이 입력되었습니다." });
};

export default createComments;