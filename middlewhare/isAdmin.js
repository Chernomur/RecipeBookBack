module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.sendStatus(403);
    }

    next();
  } catch (e) {
    console.error(e)
    res.sendStatus(500);
  }
}
