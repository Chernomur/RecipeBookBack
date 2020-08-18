"use strict";
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
        len: [3, 50],
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        trim: true,
        isLowercase: true,
        isEmail: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        required: true,
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
  return User;
};

// userScheme.post("findOne", function (result) {
//   if (result && result.avatar) {
//     result.avatar = `http://localhost:${config.port}/${result.avatar}`;
//   }

//   return result;
// });

// userScheme.post("findOneAndUpdate", function (result) {
//   if (result.avatar) {
//     result.avatar = `http://localhost:${config.port}/${result.avatar}`;
//   }

//   return result;
// });
