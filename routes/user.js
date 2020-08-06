const express = require('express');
const router = express.Router();
const userController = require("../controllers/user")
const isAuth = require("../middlewhare/isAuth")
const isAdmin = require("../middlewhare/isAdmin")

router.use(isAuth)
router.get("/", isAdmin, userController.allUsers);
router.get("/:id", userController.findOne);
router.post("/", isAdmin, userController.create);
router.post("/upload",function (req, res, next) {
  let filedata = req.file;
  console.log(Object.keys(req))
  if(!filedata)
    res.send("Ошибка при загрузке файла");
  else
    res.send("Файл загружен");
});
router.delete("/:id", userController.delete);
router.patch("/:id", userController.update);

module.exports = router;
