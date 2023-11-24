import express from 'express';
import db from '../../models/index.js';
import { Op } from 'sequelize';
import upload from '../multer.js';
import {needSignin} from '../../middlewares/need-signin.middleware.js'

const { Users, Projects } = db;
const projectRouter = express.Router();

// 게시물 생성 creat
projectRouter.post('/post',  needSignin, upload.array('additional'), async (req, res) => {
    const { projectTitle,teamName, overView,techStack,githubAddress,coreFunction,demoSite, description } = req.body;
    let filePath = [];

    if(req.files !== undefined){
        req.files.forEach((file)=> filePath.push(file.key))
    }

    try {
        const existingUser = await Users.findByPk(1);
        const project = await Projects.create({ 
            title:projectTitle,
            teamName:teamName,
            overView:overView,
            tech_stack:techStack,
            github_address:githubAddress,
            core_function:coreFunction,
            demo_site:demoSite,
            description, user_id: existingUser.user_id,
            images_path:filePath.join(",")
        });
        res.status(200).json({ message: "게시물 등록 완료", project });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "게시물 생성 중에 오류 발생" });
    }
})

// 게시물 조회
projectRouter.get('/posts', async (req, res) => {
    try {
        console.log("res.locals.user", res.locals.user);
        const projects = await Projects.findAll();
        res.status(200).json({ message: "게시물 조회", projects });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "게시물 조회 오류" });
    }
});

// 게시물 상세 조회
projectRouter.get('/post/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const projects = await Projects.findByPk(postId);
        res.status(200).json({ message: "게시물 상세 조회", projects });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "게시물 조회 오류" });
    }
});

// 게시물 검색
projectRouter.get('/post', async (req, res) => {
    const { postName } = req.query;
    try {
        const projects = await Projects.findAll({ where: { title: { [Op.like]: `%${postName}%` } } });
        if(projects.length !== 0){
            res.status(200).json({ message: "게시물 검색", projects });
        }else {
            res.status(404).json({message: "게시물이 없습니다"});
        }
        
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "게시물 검색 오류" });
    }
});

// 게시물 수정
projectRouter.put('/post/:postId', needSignin, async (req, res) => {
    const postId = req.params.postId;
    const { projectTitle,teamName, overView,techStack,githubAddress,coreFunction,demoSite, description } = req.body;
    try {
        if (postId) {
            const project = await Projects.findByPk(postId);

            
            await project.update({ projectTitle,teamName, overView,techStack,githubAddress,coreFunction,demoSite, description });

            res.status(200).json({ massege: "게시물 수정 완료", project });
        } else {
            res.status(400).json({ message: "오류" });
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "게시물 조회 오류" });
    }
});

// 게시물 삭제
projectRouter.delete('/post/:postId',  needSignin, async (req, res) => {
    const postId = req.params.postId;
    try {
        if (postId) {
            const project = await Projects.findByPk(postId);

            await project.destroy({ where: { poject_id: postId } });
            res.status(200).json({ message: "게시물 삭제 성공" });
        } else {
            res.status(400).json({ message: "게시물이 존재하지 않습니다" });
        }
    } catch {
        console.error(error);
        res.status(400).json({ message: "게시물 삭제 오류" });
    }
});

export default projectRouter;