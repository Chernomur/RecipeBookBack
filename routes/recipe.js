const express = require('express');
const router = express.Router();
const recipeController = require("../controllers/recipe")

//router.use(isAuth)
router.get("/", recipeController.allRecipe);
// router.get("/:id", recipeController.findOne);
router.post("/", recipeController.createRecipe);
router.delete("/:id", recipeController.deleteRecipe);
// router.patch("/:id", recipeController.update);

module.exports = router;
