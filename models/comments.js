import { Model, DataTypes } from "sequelize";
export default class Comments extends Model {
  static init(sequelize) {
    return super.init({
      comment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      project_id: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      contents: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }, {
      sequelize,
      modelName: 'Comments',
    });
  }

  static associate(db) {
    db.Comments.belongsto(db.Projects, { foreignKey: 'project_id', sourceKey: "project_id" });
  }
}