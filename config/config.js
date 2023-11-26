import dotenv from 'dotenv';

dotenv.config();

const sequelizeConfig = {
  username: process.env.DB_ID,
  password: process.env.DB_PW,
  database: 'sparta-folio',
  host: process.env.AWS_RDS_ENDPOIN,
  dialect: 'mysql',
};

export default sequelizeConfig;
