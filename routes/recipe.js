const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe");
const isAuth = require("../middlewhare/isAuth");
const isAdmin = require("../middlewhare/isAdmin");
const isAdminOrOwner = require("../middlewhare/isAdminOrOwner");
const multer = require("../middlewhare/multer");

router.use(isAuth);
router.get("/", recipeController.allRecipe);
router.get("/:id", recipeController.findOne);
router.post(
  "/",
  multer("public/dishes").single("file"),
  recipeController.createRecipe
);
router.post(
  "/upload",
  multer("public/dishes").single("file"),

  recipeController.uploadImg
);
router.delete("/:id", recipeController.deleteRecipe);
router.patch("/:id", recipeController.updateRecipe);

module.exports = router;
