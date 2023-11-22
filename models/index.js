import Sequelize from 'sequelize';
import sequelizeConfig from "../config/config.js";
import Users from "./users.js";
import Projects from "./projects.js";
import Comments from "./comments.js"

const env = process.env.NODE_ENV || 'development';
const db = {};

const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Users = Users;
db.Projects = Projects;
db.Comments = Comments;

Users.init(sequelize);
Projects.init(sequelize);
Comments.init(sequelize);

Users.associate(db);
Projects.associate(db);
Comments.associate(db);


export default db;