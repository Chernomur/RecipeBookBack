const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userScheme = new Schema(
    {
      role: {
        type: String,
        enum : ['client','admin'],
        default: 'client'
      },
      fullName: {
        type: String,
        minlength: 3,
        maxlength: 50
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required:[true, 'Email address is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
      },
      password: {
        type: String,
        required: true,
      }
    },
    {versionKey: false});

const User = mongoose.model("User", userScheme);
module.exports = User;
