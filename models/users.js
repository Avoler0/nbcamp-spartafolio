import { Model, DataTypes } from "sequelize";
export default class Users extends Model {
  static init(sequelize){
    return super.init({
      user_id: {
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
      modelName: 'Users',
      tableName: 'Users',
      timestamps: true,
      underscored: false,
    })
  }
  static associate(db) {
    db.Users.hasMany(db.Comments, { targetKey: 'user_id', foreignKey: "user_id" });
    db.Users.hasMany(db.Projects, {targetKey: 'user_id', foreignKey: "user_id"});
  }
}
