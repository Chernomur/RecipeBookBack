"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Recipe.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        secondaryKey: true,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        len: [3, 50],
        allowNull: false,
      },

      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      difficulty: {
        type: DataTypes.INTEGER,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        required: true,
      },
      cookingTime: {
        type: DataTypes.INTEGER,
        required: true,
      },
    },
    {
      sequelize,
      modelName: "Recipe",
    }
  );
  return Recipe;
};
