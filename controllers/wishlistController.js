const Model = require("../models/wishlistModel");
const handleFactory = require("./handleFactory");
 

exports.getAllWishlist = handleFactory.getAll(Model);

exports.getWishlist = handleFactory.getOne(Model);

exports.updateWishlist = handleFactory.updateOne(Model);

exports.updateWishlistItem = handleFactory.updateCartItem(Model);

exports.createWishlist = handleFactory.createCartItem(Model);

exports.updateExisiting = handleFactory.updateExisiting(Model);

exports.deleteWishlist = handleFactory.deleteOne(Model);
