const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recipeScheme = new Schema(
  {
    title: {
      type: String,
      minlength: 1,
      maxlength: 50,
      required: true
    },
    overview: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    difficulty: {
      type: String,
      required: true
    },
    cookingTime: {
      type: Number,
      required: true
    }
  },
  {versionKey: false});

const Recipe = mongoose.model("Recipe", recipeScheme);
module.exports = Recipe;
