import { Model, DataTypes } from "sequelize";
export default class Projects extends Model {
  static init(sequelize){
    return super.init({
      project_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type:DataTypes.INTEGER
      },
      title:{
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    }, {
      sequelize,
      modelName: 'Projects',
      tableName: 'projects',
      timestamps: true,
			underscored: false,
    })
  }
  static associate(db) { db.Projects.belongsTo(db.Users, { targetKey:'user_id', foreignKey: "user_id" })};
}
