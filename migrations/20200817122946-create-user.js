"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fullName: {
        type: Sequelize.STRING,
        validate: {
          len: [3, 50],
        },
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM("client", "admin"),
        allowNull: false,
        defaultValue: "client",
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isLowercase: true,
          isEmail: true,
        },
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        required: true,
      },
      avatar: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Users");
  },
};
