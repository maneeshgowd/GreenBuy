const Model = require("../models/productModel");
const handleFactory = require("./handleFactory");

exports.getAllProducts = handleFactory.getAll(Model);

exports.createOneProduct = handleFactory.createOne(Model);

exports.getOneProduct = handleFactory.getOne(Model);

exports.updateOneProduct = handleFactory.updateOne(Model);

exports.deleteOneProduct = handleFactory.deleteOne(Model);
