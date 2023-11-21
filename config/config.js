import dotenv from 'dotenv';

dotenv.config();

const sequelizeConfig = {
  "username": process.env.DB_ID,
  "password": process.env.DB_PW,
  "database": "sparta-folio",
  "host": "127.0.0.1",
  "dialect": "mysql"
}


export default sequelizeConfig;
