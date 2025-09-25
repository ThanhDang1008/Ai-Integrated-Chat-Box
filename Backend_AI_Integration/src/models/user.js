'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        foreignKey: 'idrole',
        as: 'role'
      })

      User.hasMany(models.Conversation,{
         foreignKey: 'iduser',
         as: 'conversations'
      })

      User.hasMany(models.File,{
        foreignKey: 'iduser',
        as: 'files'
      })

      User.hasMany(models.Chatbot,{
        foreignKey: 'iduser',
        as: 'chatbots'
      })
    }
  }
  User.init({
    fullname: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    urlavatar: DataTypes.STRING,
    status: DataTypes.STRING,
    type: DataTypes.STRING,
    idrole: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};