const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  potName: {
    type: String,
    unique: true,
    trim: true,
    minlength: [5, "A pot name should be atleast 5 characters long!"],
    required: [true, "A pot should have a name!"],
  },

  images: [String],

  ratings: {
    type: Number,
    default: 4.5,
  },

  price: {
    type: Number,
    required: [true, "A pot should have a price!"],
  },

  publishedAt: {
    type: Date,
    select: false,
    default: Date.now(),
  },
});

const model = mongoose.model("Pots", Schema);

module.exports = model;
