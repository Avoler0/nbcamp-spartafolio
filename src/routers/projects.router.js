import express from 'express';
import db from '../../models/index.js';
// import Users from '../../models/users.js'
const {Users, Projects} = db;
const projectRouter = express.Router();

// creat
projectRouter.post('/post', async (req, res) => {
    try {
        const { title, like, description } = req.body;
        const existingUser = await Users.findByPk(1);
        const project = await Projects.create({ title, description, user_id:existingUser.user_id, like });
        res.status(200).json({ message: "게시물 등록 완료", project });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "게시물 생성 중에 오류 발생" });
    }
})



export default projectRouter;