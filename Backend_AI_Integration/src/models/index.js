'use strict';
require('dotenv').config()
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const process = require('process');
// const config = require(__dirname + '/../config/config.json')[env];
const db = {};


let sequelize;
const customizeConfig = {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  logging: false,
  query: {
      raw: true,
      //timezone: '+07:00'
      timezone: '+07:00'
  },
  // dialectOptions: {
  //     useUTC: false,
  //     dateStrings: true,
  //     typeCast: function (field, next) {
  //         if (field.type === 'DATETIME') {
  //             return field.string();
  //         }
  //         return next
  //     }
  // },
  timezone: '+07:00'
}

sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME,process.env.DB_PASSWORD,customizeConfig)

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }



fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
