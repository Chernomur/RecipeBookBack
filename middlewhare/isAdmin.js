const errorHandler = require("../utils/errorHandler");

module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .send({ message: "You have no permissions to see that" });
    }
    next();
  } catch (e) {
    console.error(e);
  }
};
