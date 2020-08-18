const jwt = require("jsonwebtoken");
const config = require("../config/index");

module.exports = {
  create: function (user) {
    return jwt.sign({ id: user.id }, config.signature, {
      expiresIn: config.expiration,
    });
  },
  verify: function (auth) {
    return jwt.verify(auth, config.signature);
  },
};
