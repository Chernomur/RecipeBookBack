const db = require("../models");
const crypto = require("../utils/crypto");
const token = require("../utils/token");
const validation = require("../utils/validation");
const errorHandler = require("../utils/errorHandler");

const singIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await db.User.findOne({ where: { email } });

    if (!email) {
      return res.status(400).send({ field: "email", message: "invalid email" });
    }

    if (!password) {
      return res
        .status(400)
        .send({ field: "password", message: "invalid password" });
    }

    if (!user) {
      return res.status(404).send({
        field: "email",
        message: "The email is incorrect.",
      });
    }

    if (crypto(password) !== user.password) {
      return res
        .status(400)
        .send({ field: "password", message: "The password is incorrect." });
    }

    user = user.toJSON();
    delete user.password;

    res.json({ token: token.create(user.id), user });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

const singUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!validation.password(password)) {
      return res
        .status(400)
        .send({ code: 400, message: "invalid password", field: "password" });
    }

    let user = new db.User({ fullName, email, password: crypto(password) });

    await user.save();

    user = user.toJSON();
    delete user.password;
    //console.log("tokenfs", { token: token.create(user.id), user });
    res.json({ token: token.create(user.id), user });
  } catch (e) {
    console.error(e);
    console.log("register controller", e);
    const error = errorHandler(res, e);
    res.status(error.code).send(error);
  }
};
const check = async (req, res) => {
  try {
    const user = req.user.toJSON();
    delete user.password;

    res.json(user);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

module.exports = {
  singIn,
  singUp,
  check,
};
