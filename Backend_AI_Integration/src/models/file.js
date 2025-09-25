"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      File.belongsTo(models.User, {
        foreignKey: "iduser",
        as: "user",
      });

      File.belongsToMany(models.Chatbot, {
        through: "Chatbot_Files",
        foreignKey: "idfile",
        as: "chatbots",
      });
    }
  }
  File.init(
    {
      keyfile: DataTypes.STRING,
      urlfile: DataTypes.STRING,
      originalname: DataTypes.STRING,
      iduser: DataTypes.STRING,
      type: DataTypes.STRING,
      urlCloudinary: DataTypes.STRING,
      ocr: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "File",
    }
  );
  return File;
};
