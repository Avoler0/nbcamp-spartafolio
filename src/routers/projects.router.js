import express from 'express';
import Project from '../../models/projects.js';

const projectRouter = express.Router();

projectRouter.post('/post', async (req, res) => {
    console.log(Project);
    try {
        const { title,user_id, like, description } = req.body;
        const project = await Project.create({ title, description,user_id, like });
        res.status(200).json({ message: "게시물 등록 완료", project });
    } catch (error) {
        res.status(400).json({ message: "게시물 생성 중에 오류 발생" });
    }
})

export default projectRouter;