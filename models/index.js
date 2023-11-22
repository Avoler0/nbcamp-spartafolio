import Sequelize from 'sequelize';
import sequelizeConfig from "../config/config.js";
import User from "./users.js";
import Projects from "./projects.js";

const env = process.env.NODE_ENV || 'development';
const db = {};

const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Projects = Projects;

User.init(sequelize);
Projects.init(sequelize);

User.associate(db);
Projects.associate(db);

export default db;