import db from '../../../models/index.js';
const { Comments } = db;

// 댓글 확인하기 (Read))
const readComments = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log('projectId: ', projectId);

    const comments = await Comments.findAll({
      where: {
        project_id: projectId, // 특정 project에 있는 댓글들을 다 가져온다 !
      },
    });

    res.status(200).json({ message: "댓글 조회에 성공했습니다.", comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류' });
  }
};

export default readComments;