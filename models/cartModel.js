const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "products",
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: [true, "A Cart must belong to a user!"],
  },
});

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id",
  }).populate({
    path: "products",
    select: "plantName plantType price",
  });
  next();
});

const Model = mongoose.model("Cart", Schema);

module.exports = Model;
