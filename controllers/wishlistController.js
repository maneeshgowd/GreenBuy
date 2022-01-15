const Model = require("../models/wishlistModel");
const handleFactory = require("./handleFactory");

exports.getAllWishlist = handleFactory.getAll(Model);

exports.getWishlist = handleFactory.getOne(Model);

exports.updateWishlist = handleFactory.updateOne(Model);

exports.createWishlist = handleFactory.createOne(Model);

exports.deleteWishlist = handleFactory.deleteOne(Model);
