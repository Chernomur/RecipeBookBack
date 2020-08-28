const db = require("../models");
const crypto = require("../utils/crypto");
const errorHandler = require("../utils/errorHandler");
const validation = require("../utils/validation");
const Sequelize = require("sequelize");
const fs = require("fs");
const config = require("../config");

const fsPromised = fs.promises;

const Op = Sequelize.Op;

const allRecipe = async (req, res) => {
  try {
    const {
      timeFrom,
      timeTo,
      difficulty,
      sortField,
      sortOrder,
      search,
    } = req.query;
    let options = { where: {} };
    console.log("sortOrder", sortOrder);

    if (search) {
      // options.where.title = { [Op.like]: "%" + search.toLowerCase() + "%" };
      const title = Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("title")),
        "LIKE",
        "%" + search.toLowerCase() + "%"
      );
      const description = Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("description")),
        "LIKE",
        "%" + search.toLowerCase() + "%"
      );

      options.where = {
        [Op.or]: [title, description],
      };
    }
    if (difficulty) {
      options.where.difficulty = difficulty;
    }
    if (timeFrom && timeTo) {
      options.where.cookingTime = { [Op.between]: [timeFrom, timeTo] };
    }
    if (sortField) {
      options.order = [[sortField, sortOrder]];
    }
    console.log("options", options);

    recipes = await db.Recipe.findAll(options);

    res.json(recipes);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
};

const findOne = async (req, res) => {
  try {
    const { id } = req.params;

    let recipe = await db.Recipe.findOne({
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
    const { file } = req;

    let userId = req.user.id;
    let image;
    if (authorId && req.user.role === "admin") {
      userId = authorId;
    }

    if (file) {
      image = file.path.replace("public/", "");
    }

    let recipe = new db.Recipe({
      authorId: userId,
      image: image,
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

    let recipe = await db.Recipe.findOne({ where: { id } });

    if (!(req.user.role === "admin" || req.user.id === recipe.authorId)) {
      return res.status(403).send({ message: "Forbidden" });
    }

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

    let recipe = await db.Recipe.findOne({ where: { id } });

    if (!(req.user.role === "admin" || req.user.id === recipe.authorId)) {
      return res.status(403).send({ message: "Forbidden" });
    }

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

const uploadImg = async (req, res) => {
  let { file } = req;
  let recipeId = req.body.id;

  if (!recipeId) {
    res.status(404).send();
  }

  if (!file) {
    res.status(400).send({ field: "inputFile", message: "incorrect file" }); //
  }

  let recipe = await db.Recipe.findOne({ where: { id: recipeId } });

  if (!(req.user.role === "admin" || req.user.id === recipe.authorId)) {
    return res.status(403).send({ message: "Forbidden" });
  }

  if (recipe.image) {
    await fsPromised
      .unlink(
        recipe.image.replace(`${config.addressServer}`, "public/") //file removed
      )
      .catch(() => null);
  }

  recipe.image = file.path.replace("public/", "");

  await db.Recipe.update({ image: recipe.image }, { where: { id: recipe.id } });

  recipe = recipe.toJSON();
  res.send(recipe);
};

module.exports = {
  allRecipe,
  createRecipe,
  findOne,
  deleteRecipe,
  updateRecipe,
  uploadImg,
};
