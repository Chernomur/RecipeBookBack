const app = require("./app");
const config = require("./config");
const { Sequelize } = require("sequelize");
const db = require("./models");

const sequelize = new Sequelize("recipebook", "postgres", "123456", {
  host: "localhost",
  dialect: "postgres",
});

// try {
//   sequelize.authenticate();
//   console.log("Connection has been established successfully.");

//   sequelize.sync({ force: true }).then(() => {
//     db.User.create({
//       fullName: "qwe",
//       email: "qwe@qwe.qwe",
//       password: "qwe",
//       avatar: "qwe",
//     });
//   });
//   console.log("All models were synchronized successfully.");
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }
app.listen(config.port, function () {
  console.log(`Сервер ожидает подключения порт ${config.port}...`);
});
