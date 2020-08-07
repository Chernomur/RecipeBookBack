const db = require("../models")
const crypto = require("../utils/crypto")
const token = require("../utils/token")
const errorHandler = require("../utils/errorHandler")

const singIn = async (req, res) => {
  try {
    const {email, password} = req.body;

    let user = await db.User.findOne({email});
    if (!user) {
      return res.sendStatus(404);
    }
    if (!password){
      return res.status(400).send("invalid password")
    }
    if (crypto(password) !== user.password) {
      return res.status(400).send("invalid password")
    }

    user = user.toJSON();
    delete user.password;
    res.json({token: token.create(user._id), user});
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

module.exports = {
  singIn,
  singUp: async function singUp(req, res) {
    try {
      const {fullName, email, password} = req.body;

      let user = new db.User({fullName, email, password: crypto(password)});

      await user.save();

      user = user.toJSON();
      delete user.password;

      res.json({token: token.create(user._id), user});
    } catch (e) {
      console.error(e);

      const error = errorHandler(e);
      res.status(error.code).send(error.message);
    }
  },
  check: async function check(req, res) {
    try {
      const user = req.user.toJSON();
      delete user.password;

      res.json(user);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
};
