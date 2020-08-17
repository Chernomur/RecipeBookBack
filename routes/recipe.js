const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe");
const isAuth = require("../middlewhare/isAuth");
const isAdmin = require("../middlewhare/isAdmin");
const isAdminOrOwner = require("../middlewhare/isAdminOrOwner");

router.use(isAuth);
router.get("/", recipeController.allRecipe);
// router.get("/:id", recipeController.findOne);
router.post("/", recipeController.createRecipe);
router.delete("/:id", isAdminOrOwner, recipeController.deleteRecipe);
// router.patch("/:id", recipeController.update);

module.exports = router;
