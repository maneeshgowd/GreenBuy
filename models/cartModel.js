const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  product: [
    {
      type: mongoose.Schema.ObjectId,
      required: [true, "A cart must have a product!"],
      ref: "products",
    },
  ],

  pot: [
    {
      type: mongoose.Schema.ObjectId,
      required: [true, "A cart must have a product!"],
      ref: "Pots",
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, "A cart must have a user!"],
    ref: "Users",
  },
});

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "plantName plantType price images",
  })
    .populate({
      path: "pot",
      select: "potName price images ratings",
    })
    .populate({
      path: "user",
      select: "_id",
    });
  next();
});

const Model = mongoose.model("usercart", Schema);

module.exports = Model;
