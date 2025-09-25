'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatbot_File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chatbot_File.init({
    idchatbot: DataTypes.STRING,
    idfile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chatbot_File',
  });
  return Chatbot_File;
};