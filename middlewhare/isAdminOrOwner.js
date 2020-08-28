module.exports = async (req, res, next) => {
  try {
    if (req.user.role === "admin" || req.user.id === Number(req.params.id)) {
      next();
    } else {
      return res.status(403).send({ message: "Forbidden" });
    }
  } catch (e) {
    console.error(e);
  }
};
