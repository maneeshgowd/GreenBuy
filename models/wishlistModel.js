const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  product: [
    {
      type: mongoose.Schema.ObjectId,
      required: [true, "A wishlist must have a product!"],
      ref: "products",
    },
  ],

  pot: [
    {
      type: mongoose.Schema.ObjectId,
      required: [true, "A wishlist must have a product!"],
      ref: "Pots",
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: [true, "A wishlist must belong to a user!"],
  },
});

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id",
  })
    .populate({
      path: "pot",
      select: "potName price images ratings",
    })
    .populate({
      path: "product",
      select: "plantName price images plantType ratings",
    });
  next();
});

const Model = mongoose.model("userWishlist", Schema);

module.exports = Model;
