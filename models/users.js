import { Model, DataTypes } from "sequelize";
export default class Users extends Model {
  static init(sequelize){
    return super.init({
      user_id: {
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
      modelName: 'Users',
      tableName: 'users',
      timestamps: true,
			underscored: false,
    })
  }
  static associate(db) {
    db.Users.hasMany(db.Projects, {foreignKey: 'user_id', sourceKey: "user_id"});
  }
}
