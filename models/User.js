const mongoose = require("mongoose");
const config = require("../config");
const Schema = mongoose.Schema;

const userScheme = new Schema(
  {
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
    fullName: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email address is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  { versionKey: false }
);

userScheme.post("findOne", function (result) {
  if (result && result.avatar) {
    result.avatar = `http://localhost:${config.port}/${result.avatar}`;
  }

  return result;
});

userScheme.post("findOneAndUpdate", function (result) {
  if (result.avatar) {
    result.avatar = `http://localhost:${config.port}/${result.avatar}`;
  }

  return result;
});

const User = mongoose.model("User", userScheme);
module.exports = User;
