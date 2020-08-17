module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && !req.user._id === id) {
      throw { code: 403, message: "Forbidden" };
    }

    next();
  } catch (e) {
    console.error(e);

    return errorHandler(res, e);
  }
};
