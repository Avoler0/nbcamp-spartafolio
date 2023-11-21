import Sequelize from 'sequelize';
import sequelizeConfig from "../config/config.js";
import User from "./users.js";
import Product from "./products.js";

const env = process.env.NODE_ENV || 'development';
const db = {};

const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, sequelizeConfig);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Product = Product;

User.init(sequelize);
Product.init(sequelize);

User.associate(db);
Product.associate(db);

export default db;