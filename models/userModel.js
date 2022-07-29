const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
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
    select: false,
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
  },

  photo: {
    type: String,
    default: "default.jpg",
  },

  passwordChangedAt: {
    type: Date,
    select: false,
  },

  passwordResetToken: String,
  passwordResetExpires: Date,

  country: {
    type: String,
    trim: true,
    default: "India",
  },

  postcode: {
    type: Number,
    trim: true,
    default: 560010,
  },

  address: {
    type: String,
    minlength: [15, "An address must be atleast 15 characters long!"],
    trim: true,
    default: "Example: #01, Your address, address lane, city state country - postcode",
  },

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

schema.pre("save", function (next) {
  // if the password is ! modified or if the doc is new
  if (!this.isModified("password") || this.isNew) return next();
  // sometimes token will be created before the passwordChangedAt  has been created so we need to fix this by subtratic 1s
  this.passwordChangedAt = Date.now() - 1000;
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

schema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;

  return resetToken;
};

const Model = mongoose.model("Users", schema);

module.exports = Model;
