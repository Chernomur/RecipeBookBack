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
        validate: {
          len: [3, 50],
        },
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
        type: DataTypes.ENUM("Ease", "Middle", "Hard"),
        allowNull: false,
      },
      cookingTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Recipe",
    }
  );
  return Recipe;
};
