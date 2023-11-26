import { Model, DataTypes } from "sequelize";
export default class Projects extends Model {
  static init(sequelize) {
    return super.init(
      {
        project_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          foreignKey: true,
          type: DataTypes.INTEGER,
        },
        user_id: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        like: {
          allowNull: true,
          type: DataTypes.INTEGER,
        },
        title: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        team_name: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        over_view: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        view: {
          type: DataTypes.INTEGER,
        },
        tech_stack: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        github_address: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        demo_site: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        core_function: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        description: {
          allowNull: true,
          type: DataTypes.TEXT('long'),
        },
        images_path: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: 'Projects',
        tableName: 'Projects',
        timestamps: true,
        underscored: false,
      },
    );
  }
  static associate(db) {
    db.Projects.hasMany(db.Comments, { targetKey: 'project_id', foreignKey: "project_id" });
    db.Projects.belongsTo(db.Users, { targetKey: 'user_id', foreignKey: "user_id" });
  }
}

