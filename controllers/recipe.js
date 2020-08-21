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

const findOne = async (req, res) => {
  try {
    const { id } = req.params;

    let recipe = await db.Recipe.findAll({
      where: { id },
      include: { model: db.User, as: "user", attributes: ["id", "email"] },
    });
    if (!recipe) {
      return res.sendStatus(404);
    }

    res.json(recipe);
  } catch (e) {
    console.error(e);
    res.send(e.message);
  }
};

const createRecipe = async (req, res) => {
  try {
    const { authorId, title, description, difficulty, cookingTime } = req.body;
    let userId = req.user.id;
    if (authorId && req.user.role === "admin") {
      userId = authorId;
    }

    let recipe = new db.Recipe({
      authorId: userId,
      title,
      description,
      difficulty,
      cookingTime,
    });

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

    await db.Recipe.findByIdAndDelete(id);

    res.sendStatus(204);
  } catch (e) {
    console.error(e);

    return errorHandler(res, e);
    // res.status(error.code).send(error.message);
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty, cookingTime } = req.body;

    let recipe = await db.Recipe.findAll({ where: { id } });

    if (title) {
      recipe.title = title;
    }
    if (description) {
      recipe.description = description;
    }
    if (difficulty) {
      recipe.difficulty = difficulty;
    }
    if (cookingTime) {
      recipe.cookingTime = cookingTime;
    }

    await db.Recipe.update(
      { title, description, difficulty, cookingTime },
      { where: { id } }
    );
    res.json(recipe);
  } catch (e) {
    console.error(e);

    const error = errorHandler(res, e);
    res.status(error.code).send(error.message);
  }
};

module.exports = {
  allRecipe,
  createRecipe,
  findOne,
  deleteRecipe,
  updateRecipe,
};
