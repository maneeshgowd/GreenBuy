const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name!"],
    minlength: [5, "A user name must be atleast 5 characters long!"],
    maxlength: [30, "A user name cannot exceed more than 30 characters long!"],
    trim: true,
    lowercase: true,
  },

  email: {
    type: String,
    trim: true,
    unique: true,
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },

      message: "Please enter a valid email!",
    },

    required: [true, "A user must have an email address!"],
    lowercase: true,
  },

  password: {
    type: String,
    trim: true,
    required: [true, "A user must have a password!"],
    minlength: [8, "A password must be atleast 8 characters long!"],
    maxlength: [15, "A password cannot exceed more than 15 characters!"],
  },

  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, "A user must have a repeat password!"],
    minlength: [8, "A password must be atleast 8 characters long!"],
    maxlength: [15, "A password cannot exceed more than 15 characters!"],
    select: false,

    validate: {
      validator: function (passwordConfirm) {
        return this.password === passwordConfirm;
      },

      message: "Password dosen't match!",
    },
  },

  role: {
    type: String,
    enum: ["admin", "user", "seller"],
    default: "user",
    select: false,
  },

  photo: {
    type: String,
    default: "default.jpg",
    select: false,
  },

  passwordChangedAt: {
    type: Date,
    select: false,
  },

  passwordResetToken: String,
  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

schema.methods.validateUserPassword = async function (givenPassword, existingPassword) {
  return await bcrypt.compare(givenPassword, existingPassword);
};

schema.methods.changedPasswordAfter = function (JWT_TIMESTAMP) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWT_TIMESTAMP < changedTimeStamp;
  }

  return false;
};

const Model = mongoose.model("Users", schema);

module.exports = Model;
