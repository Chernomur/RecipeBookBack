"use strict";
const config = require("../config");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      fullName: {
        type: DataTypes.STRING,
        validate: {
          len: [3, 50],
        },
        unique: false,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("client", "admin"),
        allowNull: false,
        defaultValue: "client",
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isLowercase: true,
          isEmail: true,
        },
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.addHook("afterFind", (user, options) => {
    if (Array.isArray(user)) {
      user.map((item) => {
        item.dataValues.avatar = `${config.addressServer}${item.dataValues.avatar}`;
      });
    }
    if (user && user.avatar) {
      user.avatar = `${config.addressServer}${user.avatar}`;
    }
  });
  return User;
};
