const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  product: [Object],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: [true, "Booking must belong to user!"],
  },

  price: {
    type: Number,
    required: [true, "Booking must have a price!"],
  },

  quantity: {
    type: Number,
    required: [true, "Bookings products must have quantity!"],
    default: 1,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  paid: {
    type: Boolean,
    default: true,
  },
});

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "_id",
  })
    .populate({
      path: "product",
      select: "plantName price images",
    })
    .populate({
      path: "pot",
      select: "potName price images",
    });

  next();
});

const Model = mongoose.model("Bookings", Schema);

module.exports = Model;
