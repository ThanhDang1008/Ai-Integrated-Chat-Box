"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chatbot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Chatbot.belongsTo(models.User, {
        foreignKey: "iduser",
        as: "user",
      });
      Chatbot.belongsToMany(models.File, {
        through: "Chatbot_Files",
        foreignKey: "idchatbot",
        as: "files",
      });
    }
  }
  Chatbot.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      content: DataTypes.TEXT("long"),
      thumbnail: DataTypes.STRING,
      iduser: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Chatbot",
    }
  );
  return Chatbot;
};
