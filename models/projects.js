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
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      like: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      description: {
        allowNull: false,
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
      tableName: 'Projects',
      timestamps: true,
      underscored: false,
    })
  }
  static associate(db) {
    db.Projects.hasMany(db.Comments, { targetKey: 'project_id', foreignKey: "project_id" });
    db.Projects.belongsTo(db.Users, { targetKey: 'user_id', foreignKey: "user_id" });
  }
}

