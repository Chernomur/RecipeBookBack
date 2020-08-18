const db = require("../models");
const crypto = require("../utils/crypto");
const errorHandler = require("../utils/errorHandler");
const validation = require("../utils/validation");

const allRecipe = async (req, res) => {
  try {
    const recipes = await db.Recipe.findAll();

    res.json(recipes);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
};

const createRecipe = async (req, res) => {
  try {
    const { title, description, difficulty, cookingTime } = req.body;

    let recipe = new db.Recipe({ title, description, difficulty, cookingTime });

    await recipe.save();
    recipe = recipe.toJSON();
    res.json(recipe);
  } catch (e) {
    console.error(e.name);

    const error = errorHandler(res, e);
    res.status(error.code).send(error.message);
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const id = req.params.id;

    // if (req.user.role !== "admin" && !req.user._id === id) {
    //   throw { code: 403, message: 'Forbidden' }
    // }

    await db.Recipe.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (e) {
    console.error(e);

    return errorHandler(res, e);
    // res.status(error.code).send(error.message);
  }
};

module.exports = {
  allRecipe,
  createRecipe,

  deleteRecipe,
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
  //     const error = errorHandler(res,e);
  //     res.status(error.code).send(error.message);
  //   }
  // },
};
