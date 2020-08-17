const multer = require("multer");
const db = require("../models");

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" //400
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = {
  storageConfig,
  fileFilter,
};
