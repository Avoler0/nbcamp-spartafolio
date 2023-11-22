import dotenv from 'dotenv';

dotenv.config();

const sequelizeConfig = {
  "username": process.env.DB_ID,
  "password": process.env.DB_PW,
  "database": "sparta_folio",
  "host": "express-database.ca9iqludhqox.ap-northeast-2.rds.amazonaws.com",
  "dialect": "mysql"
}

export default sequelizeConfig;
