import express from 'express';
import db from '../../models/index.js';
import upload from '../multer.js';
import Sequelize, { Op } from 'sequelize';
import {needSignin} from '../../middlewares/need-signin.middleware.js'

const { Users, Projects, Comments } = db;
const projectRouter = express.Router();

// 게시물 생성 creat

projectRouter.post(
  '/post',
  needSignin,upload.array('additional'),
  async (req, res) => {
    const user = res.locals.user;
    const {
      projectTitle,
      teamName,
      overView,
      techStack,
      githubAddress,
      coreFunction,
      demoSite,
      description,
    } = req.body;
    let filePath = [];

    // console.log('프젝 에러',req.locals.error)
    if (req.files !== undefined) {
      req.files.forEach((file) => filePath.push(file.key));
    }

    try {
      const project = await Projects.create({
        title: projectTitle,
        team_name: teamName,
        over_view: overView,
        tech_stack: techStack,
        github_address: githubAddress,
        core_function: coreFunction,
        demo_site: demoSite,
        description,
        user_id: 1,
        images_path: filePath.join(','),
      });
      res.status(200).json({ message: '게시물 등록 완료', project });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: '게시물 생성 중에 오류 발생' });
    }
  },
);

// 게시물 조회
projectRouter.get('/posts', async (req, res) => {
    try {
        const projects = await Projects.findAll({
          attributes: [
            'project_id',
            'title',
            'team_name',
            'github_address',
            'images_path',
            'tech_stack',
            'over_view',
            'like',
            'view',
            'createdAt',
            [
              Sequelize.fn('COUNT', Sequelize.col('Comments.comment_id')),
              'comment_count',
            ],
          ],
          include: [
            {
              model: Comments,
              attributes: [],
              where: { project_id: Sequelize.col('Projects.project_id') },
              required: false, // LEFT JOIN으로 설정
            },
          ],
          group: ['Projects.project_id'],
          raw: true,
          //   order: [['createdAt', 'desc']],
        });

        res.status(200).json({ message: "게시물 조회",success:true, projects });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: '게시물 조회 오류', success:false });
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

// // 특정 게시물 조회
// projectRouter.get('/posts/:postId', async (req, res) => {
//     console.log("hi")
//     try {
//         const { postId } = req.params;

//         const project = await Projects.findOne({ where: { project_id: postId } });

//         if (!project) {
//             return res.status(404).json({ message: "게시물이 없습니다." });
//         }

//         res.status(200).json({ message: "게시물 조회 성공", project });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "알 수 없는 오류가 발생했습니다." });
//     };
// })

// 게시물 검색
projectRouter.get('/post', async (req, res) => {
    const { postName } = req.query;
    try {
        const projects = await Projects.findAll({ where: { title: { [Op.like]: `%${postName}%` } } });
        if (projects.length !== 0) {
            res.status(200).json({ message: "게시물 검색", projects });
        } else {
            res.status(404).json({ message: "게시물이 없습니다" });
        }

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "게시물 검색 오류" });
    }
});

// 게시물 수정
projectRouter.put('/post/:postId', needSignin, async (req, res) => {
    const user = res.locals.user;
    const postId = req.params.postId;
    const { projectTitle,teamName, overView,techStack,githubAddress,coreFunction,demoSite, description } = req.body;
    try {
        if (postId) {
            const project = await Projects.findByPk(postId);

            if(project.user_id !== user.user_id){
              return res.status(400).json({ message: '게시물 수정 권한이 없습니다.' });
            }
            
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
    const user = res.locals.user;
    const postId = req.params.postId;
    try {
        if (postId) {
            const project = await Projects.findByPk(postId);

            if (project.user_id !== user.user_id) {
              return res
                .status(400)
                .json({ message: '게시물 수정 권한이 없습니다.' });
            }

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