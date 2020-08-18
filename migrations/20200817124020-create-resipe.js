"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Recipes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        secondaryKey: true,
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,
        len: [3, 50],
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      difficulty: {
        type: Sequelize.INTEGER,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        required: true,
      },
      cookingTime: {
        type: Sequelize.INTEGER,
        required: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Recipes");
  },
};
