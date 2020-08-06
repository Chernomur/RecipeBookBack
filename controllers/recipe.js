const db = require("../models")
const crypto = require("../utils/crypto")
const errorHandler = require("../utils/errorHandler")
const validation = require("../utils/validation")

module.exports = {
  allRecipe: async function allRecipe(req, res) {
    try {
      const recipes = await db.Recipe.find();

      res.json(recipes);
    } catch (e) {
      console.error(e);
      return res.sendStatus(500);
    }
  },
  createRecipe: async function createRecipe(req, res) {
    try {
      const { title, overview, difficulty, cookingTime } = req.body;

      let recipe = new db.Recipe({ title, overview, difficulty, cookingTime });

      await recipe.save();
      recipe = recipe.toJSON();
      res.json(recipe);
    } catch (e) {
      console.error(e.name);

      const error = errorHandler(e);
      res.status(error.code).send(error.message);
    }
  },

  deleteRecipe: async function (req, res) {
    try {
      const id = req.params.id;

      if (req.user.role !== "admin" && !req.user._id === id) {
        return res.sendStatus(403);
      }

      await db.Recipe.findByIdAndDelete(id);

      res.sendStatus(204);
    } catch (e) {
      console.error(e);

      const error = errorHandler(e);
      res.status(error.code).send(error.message);
    }

  },
  // update: async function (req, res) {
  //   try {
  //     const {id} = req.params;
  //     const {fullName, email, password} = req.body;
  //
  //     if (req.user.role !== "admin" && !req.user._id === id) {
  //       res.sendStatus(403);
  //       return;
  //     }
  //     let user = await db.User.findById(id);
  //
  //     if (fullName) {
  //       user.fullName = fullName
  //     }
  //     if (email) {
  //       user.email = email;
  //     }
  //     if (!validation.password(password)) {
  //       return res.status(400).send("password validation failed");
  //     }
  //     if (password) {
  //       user.password = crypto(password);
  //     }
  //
  //     await user.save();
  //     user = user.toJSON();
  //     delete user.password;
  //
  //     res.json(user);
  //   } catch (e) {
  //     console.error(e);
  //
  //     const error = errorHandler(e);
  //     res.status(error.code).send(error.message);
  //   }
  // },
};