const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recipeScheme = new Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      minlength: 1,
      maxlength: 50,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    difficulty: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      required: true,
    },
    cookingTime: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

const Recipe = mongoose.model("Recipe", recipeScheme);
module.exports = Recipe;
