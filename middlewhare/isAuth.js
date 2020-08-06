const jwt = require("../utils/token");
const db = require("../models");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.sendStatus(401);
    }
    const token = req.headers.authorization.split(' ')[1];

    const {_id} = jwt.verify(token);
    const user = await db.User.findOne({_id});
    if (!user) {
      return res.sendStatus(404);
    }

    req.user = user;

    next();
  } catch (e) {
    console.error(e)
    if (e.name === "JsonWebTokenError") {
      return res.sendStatus(401);
    }
    if (e.name === "TokenExpiredError") {
      return res.sendStatus(403);
    }
    res.sendStatus(500);
  }
}
