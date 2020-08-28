const multer = require("multer");

module.exports = (storage, req, res, next) => {
  const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storage);
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
  return multer({
    storage: storageConfig,
    fileFilter: fileFilter,
  });
};
