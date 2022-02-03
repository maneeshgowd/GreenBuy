const Model = require("../models/cartModel");
const handleFactory = require("./handleFactory");

exports.getAllCartItems = handleFactory.getAll(Model);

exports.getCartItem = handleFactory.getOne(Model);

exports.updateCart = handleFactory.updateOne(Model);

exports.updateCartItem = handleFactory.updateCartItem(Model);

exports.createCartItem = handleFactory.createCartItem(Model);

exports.updateExisiting = handleFactory.updateExisiting(Model);

exports.deleteCartItem = handleFactory.deleteOne(Model);
