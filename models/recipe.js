"use strict";
const { Model } = require("sequelize");
const User = require("./user");
const config = require("../config");

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recipe.belongsTo(models.User, {
        foreignKey: "authorId",
        as: "user",
      });

      Recipe.belongsToMany(models.User, {
        through: { model: models.User_Recipes, unique: false },
        foreignKey: "RecipeId",
      });
    }
  }
  Recipe.init(
    {
      authorId: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.TEXT,
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

  Recipe.addHook("afterFind", (recipe, options) => {
    if (Array.isArray(recipe)) {
      recipe.map((item) => {
        if (item.dataValues.image) {
          item.dataValues.image = `${config.addressServer}${item.dataValues.image}`;
        }
      });
    }
    if (recipe && recipe.image) {
      recipe.image = `${config.addressServer}${recipe.image}`;
    }
  });

  return Recipe;
};
