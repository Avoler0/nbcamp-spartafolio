import db from '../../../models/comments.js';

const { Comments } = db;

// 댓글 달기 (Create)
const readComments = async (req, res) => {
  const { project_id } = req.params

  const comments = Comments.filter((comment) => comment.project_id === project_id);

  res.status(201).json({ message: "댓글이 입력되었습니다." });
};

export default createComments;