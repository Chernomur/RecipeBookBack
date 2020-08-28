const db = require("../models");
const crypto = require("../utils/crypto");
const errorHandler = require("../utils/errorHandler");
const validation = require("../utils/validation");
const fs = require("fs");
const fsPromised = fs.promises;
const config = require("../config");
const sequelize = require("sequelize");
const { countNumberPage, countPagingData } = require("../utils/pagination");
const { url } = require("inspector");

//todo first page is 1
const allUsers = async (req, res) => {
  try {
    const { page, size, orderby, order } = req.query;
    const { limit, offset } = countNumberPage(page, size);

    let users = await db.User.findAndCountAll({
      order: [[orderby, order]],
      limit,
      offset,
      attributes: { exclude: ["password"] },
      include: { model: db.Recipe, as: "recipes", attributes: ["id", "title"] },
      distinct: true,
    });

    const response = countPagingData(users, page, limit);

    res.json(response);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
};
const findOne = async (req, res) => {
  try {
    const { id } = req.params;

    let user = await db.User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  } catch (e) {
    console.error(e);
    res.send(e.message);
  }
};
const create = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!validation.password(password)) {
      return res.status(400).send("password validation failed");
    }

    let user = new db.User({ fullName, email, password: crypto(password) });

    await user.save();
    user = user.toJSON();
    delete user.password;

    res.json(user);
  } catch (e) {
    console.error(e.name);

    const error = errorHandler(res, e);
    res.status(error.code).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.role !== "admin" && !req.user._id === id) {
      return res.sendStatus(403);
    }

    await db.User.destroy({ where: { id } });

    res.sendStatus(204);
  } catch (e) {
    console.error(e);

    const error = errorHandler(res, e);
    res.status(error.code).send(error.message);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, oldPassword, newPassword } = req.body;

    if (req.user.role !== "admin" && !req.user._id === id) {
      res.sendStatus(403);
      return;
    }
    let user = req.user;
    if (fullName) {
      user.fullName = fullName;
    }
    if (email) {
      user.email = email;
    }

    if (newPassword) {
      if (crypto(oldPassword) !== user.password) {
        return res.status(400).send({
          field: "oldPassword",
          message: "Wrong password",
        });
      }

      if (!validation.password(newPassword)) {
        return res.status(400).send({
          field: "newPassword",
          message: "Password validation failed",
        });
      }

      user.password = crypto(newPassword);
    }

    await db.User.update(
      { fullName, email, password: user.password },
      { where: { id: id } }
    );

    user = user.toJSON();
    delete user.password;

    res.json(user);
  } catch (e) {
    errorHandler(res, e);
  }
};

const uploadImg = async (req, res) => {
  let { user, file } = req;

  if (!file) {
    res.status(400).send({ field: "inputFile", message: "incorrect file" }); //
  }

  if (user.avatar) {
    await fsPromised
      .unlink(
        user.avatar.replace(`${config.addressServer}`, "public/") //file removed
      )
      .catch(() => null);
  }

  user.avatar = file.path.replace("public/", "");

  await db.User.update({ avatar: user.avatar }, { where: { id: user.id } });

  user = user.toJSON();
  delete user.password;
  res.send(user);
};

const addFavorite = async (req, res) => {
  try {
    const recipeId = req.body.id;
    const favRecipe = await db.Recipe.findOne({
      where: { id: recipeId },
    });
    if (!favRecipe) {
      res.status(404).send({ message: "recipe not found" }); //
    }

    const alreadyExists = await db.User_Recipes.findOne({
      where: { UserId: req.user.id, RecipeId: recipeId },
    });

    if (alreadyExists) {
      return res.status(409).send({ message: "already in favorite" }); //
    }

    const UR = await new db.User_Recipes({
      UserId: req.user.id,
      RecipeId: recipeId,
    });
    await UR.save();

    let favorite = await db.User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
      include: [{ model: db.Recipe }],
    });
    //console.log(await favorite.getRecipes());

    res.json(favorite);
  } catch (e) {
    errorHandler(res, e);
  }
};

const delFavorite = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const favRecipe = await db.Recipe.findOne({
      where: { id: recipeId },
    });
    if (!favRecipe) {
      res.status(404).send({ message: "recipe not found" }); //
    }

    await db.User_Recipes.destroy({
      where: { UserId: req.user.id, RecipeId: recipeId },
    });

    res.sendStatus(204);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports = {
  allUsers,
  findOne,
  create,

  deleteUser,
  update,
  uploadImg,
  addFavorite,
  delFavorite,
};
