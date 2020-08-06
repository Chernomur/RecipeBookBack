const jwt = require("jsonwebtoken")
const config = require('../config');

module.exports = {
  create: function (user) {
    return jwt.sign({ _id: user._id, }, config.signature, { expiresIn: config.expiration });
  },
  verify: function (auth) {
    return jwt.verify(auth, config.signature);
  }
}