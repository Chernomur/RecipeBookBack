const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const isAuth = require("../middlewhare/isAuth");
const isAdmin = require("../middlewhare/isAdmin");
const isAdminOrOwner = require("../middlewhare/isAdminOrOwner");

router.use(isAuth);
router.get("/", isAdmin, userController.allUsers);
router.get("/:id", isAdminOrOwner, userController.findOne);
router.post("/", isAdmin, userController.create);
router.post("/upload", userController.uploadImg);
router.delete("/:id", isAdmin, userController.deleteUser);
router.patch("/:id", userController.update);

module.exports = router;
