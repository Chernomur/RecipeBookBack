const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const isAuth = require("../middlewhare/isAuth");
const isAdmin = require("../middlewhare/isAdmin");
const isAdminOrOwner = require("../middlewhare/isAdminOrOwner");
const multer = require("../middlewhare/multer");

router.use(isAuth);
router.get("/", isAdmin, userController.allUsers);
router.get("/:id", isAdminOrOwner, userController.findOne);
router.post("/", isAdmin, userController.create);
router.post(
  "/upload",
  multer("public/avatars").single("filedata"),
  userController.uploadImg
);
router.post("/favorite", userController.addFavorite);
router.delete("/favorite/:id", userController.delFavorite);
router.delete("/:id", isAdmin, userController.deleteUser);
router.patch("/:id", userController.update);

module.exports = router;
