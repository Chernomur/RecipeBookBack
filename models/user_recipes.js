"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Recipes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // models.User.belongsToMany(models.Recipe, { through: User_Recipes });
      // models.Recipe.belongsToMany(models.User, { through: User_Recipes });
    }
  }
  User_Recipes.init(
    {
      selfGranted: DataTypes.BOOLEAN,
      RecipeId: {
        type: DataTypes.INTEGER,
        secondaryKey: true,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        secondaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User_Recipes",
    }
  );
  return User_Recipes;
};
