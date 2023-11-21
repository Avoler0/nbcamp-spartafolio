import { Model, DataTypes } from "sequelize";
export default class Product extends Model {
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
      tableName: 'projects',
      timestamps: true,
			underscored: false,
    })
  }
}
