const mongoose = require("mongoose");
const slug = require("slugify");

const schema = new mongoose.Schema({
  plantName: {
    type: String,
    required: [true, "A plant should have a name!"],
    trim: true,
    unique: true,
    minlength: [5, "A plant name must be atleast 5 characters long!"],
  },

  slug: String,

  about: {
    type: String,
    trim: true,
    required: [true, "A plant should have a summary!"],
    minlength: [50, "A plant summary should be atleast 50 characters long!"],
  },

  price: {
    type: Number,
    required: [true, "A plant should have a price!"],
  },

  images: [String],

  publishedAt: {
    type: Date,
    select: false,
    default: Date.now(),
  },

  plantType: {
    type: String,
    required: [true, "A plant should have a type!"],
  },

  ratings: {
    type: Number,
    default: 4.5,
  },
});

schema.pre("save", function (next) {
  this.slug = slug(this.plantName, { lower: true });
  next();
});

const Model = mongoose.model("products", schema);

module.exports = Model;
