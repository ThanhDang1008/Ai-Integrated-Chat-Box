'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Conversation.belongsTo(models.User, {
        foreignKey: 'iduser',
        as: 'user'
      })
    }
  }
  Conversation.init({
    iduser: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.TEXT('long'),
    urlfile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};