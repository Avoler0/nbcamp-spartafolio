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

  static associate(db){
    db.Projects.belongsTo(db.Users, { targetKey: 'user_id', foreignKey: 'user_id'});
  }
}
