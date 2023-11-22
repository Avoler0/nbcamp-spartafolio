import db from '../../../models/index.js';
const { Comments, Users, Projects } = db;

// 댓글 달기 (Create)
const createComments = async (req, res) => {
  try {
    const { contents } = req.body;

    if (!contents) {
      return res.status(400).json({ message: "댓글을 입력해주세요" });
    };

    const existingProject = await Projects.findByPk(1);
    const existingUser = await Users.findByPk(1);


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
};

export default createComments;