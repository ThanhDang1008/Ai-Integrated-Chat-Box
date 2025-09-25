'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Files', {
      id: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      },
      keyfile: {
        type: Sequelize.STRING
      },
      urlfile: {
        type: Sequelize.STRING
      },
      originalname: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      iduser: {
        type: Sequelize.STRING
      },
      ocr: {
        type: Sequelize.STRING
      },
      urlCloudinary: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Files');
  }
};