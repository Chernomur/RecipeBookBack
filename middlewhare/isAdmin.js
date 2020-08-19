module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw { code: 403, message: "You have no permissions to see that" };
    }

    next();
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};
