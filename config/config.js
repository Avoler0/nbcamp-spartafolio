import dotenv from 'dotenv';

dotenv.config();

const sequelizeConfig = {
  "username": process.env.DB_ID,
  "password": process.env.DB_PW,
  "database": "database_development",
  "host": "express-database.cbcdqng86mp3.ap-northeast-2.rds.amazonaws.com",
  "dialect": "mysql"
}


export default sequelizeConfig;
