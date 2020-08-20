const db = require("../models");
const crypto = require("../utils/crypto");
const errorHandler = require("../utils/errorHandler");
const validation = require("../utils/validation");
const fs = require("fs");
const fsPromised = fs.promises;
const config = require("../config");
const sequelize = require("sequelize");

const countPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, users, totalPages, currentPage };
};

const allUsers = async (req, res) => {
  try {
    const { page, size, orderby, order } = req.query;
    const { limit, offset } = countPagination(page, size);

    let users = await db.User.findAndCountAll(
      {
        order: [[orderby, order]],
        limit,
        offset,
      },
      { attributes: { exclude: ["password"] } }
    );

    const response = getPagingData(users, page, limit);

    res.json(response);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
};
const findOne = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && !req.user._id === id) {
      return res.sendStatus(403);
    }

    let user = await db.User.findOne({ _id: id }).select("-password");
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

    await db.User.findByIdAndDelete(id);

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
    const error = errorHandler(res, e);
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

module.exports = {
  allUsers,
  findOne,
  create,

  deleteUser,
  update,
  uploadImg,
};
