import { Model, DataTypes } from "sequelize";
export default class Projects extends Model {
  static init(sequelize) {
    return super.init({
      project_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        foreignKey: true,
        type: DataTypes.INTEGER
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
      modelName: 'Projects',
      tableName: 'Projects',
      timestamps: true,
      underscored: false,
    })
  }
  static associate(db) {
    db.Projects.hasMany(db.Comments, { targetKey: 'project_id', foreignKey: "project_id" });
  };
};
