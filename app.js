const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const routes = require("./routes");
const cors = require("cors");
const multer = require("multer");
const multerConf = require("./middlewhare/multerConf");

const app = express();

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   return next();
// });
app.use(cors());
app.use(express.static("public"));
app.use(
  multer({
    storage: multerConf.storageConfig,
    fileFilter: multerConf.fileFilter,
  }).single("filedata")
);
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

routes(app);

module.exports = app;
