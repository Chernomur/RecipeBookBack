const user = require("./user")
const authorization = require("./authorization")
const recipe = require("./recipe")

module.exports = (app) => {
  app.use("/auth", authorization);
  app.use("/user", user);
  app.use("/recipe", recipe);
};
