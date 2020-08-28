"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("User_Recipes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      RecipeId: {
        type: Sequelize.INTEGER,
        secondaryKey: true,
        references: {
          model: "Recipes",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      UserId: {
        type: Sequelize.INTEGER,
        secondaryKey: true,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      selfGranted: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("User_Recipes");
  },
};
