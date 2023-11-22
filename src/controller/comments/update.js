import db from '../../../models/index.js';
const { Comments, Users } = db;

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const { contents } = req.body;

    const existingComment = await Comments.findOne({ where: { comment_id: commentId } });

    // 해당하는 댓글이 없을 경우
    if (!existingComment) {
      return res.status(404).json({ message: "해당하는 댓글이 없습니다." });
    };

    // 본인이 작성한 댓글이 아닐 경우 (추가 예정)

    await Comments.update(
      { contents },
      { where: { comment_id: commentId } }
    );

    res.status(200).json({ message: "댓글 수정에 성공했습니다." })
  } catch (error) {
    console.error(error);
    res.status(500).send("알 수 없는 오류가 발생했습니다.")
  };
};

export default updateComment