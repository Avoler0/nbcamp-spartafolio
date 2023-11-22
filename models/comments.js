// comments.js 파일에서
import { Model, DataTypes } from 'sequelize';

export default class Comments extends Model {
  static init(sequelize) {
    return super.init(
      {
        comment_id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        project_id: {
          allowNull: true,
          type: DataTypes.INTEGER
        },
        user_id: {
          allowNull: true,
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
      },
      {
        sequelize,
        modelName: 'Comments',
        timestamps: true,
        underscored: false,
      }
    );
  }

  static associate(db) {
    db.Comments.belongsTo(db.Projects, { targetKey: 'project_id', foreignKey: 'project_id' });
    db.Comments.belongsTo(db.Users, { targetKey: 'user_id', foreignKey: 'user_id' });
  }
}
