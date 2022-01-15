const Model = require("../models/cartModel");
const handleFactory = require("./handleFactory");

exports.getAllCartItems = handleFactory.getAll(Model);

exports.getCartItem = handleFactory.getOne(Model);

exports.updateCartItem = handleFactory.updateOne(Model);

exports.createCartItem = handleFactory.createOne(Model, "cart");

exports.deleteCartItem = handleFactory.deleteOne(Model);
