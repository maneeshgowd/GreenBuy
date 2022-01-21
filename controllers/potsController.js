const Model = require("../models/potsModel");
const handleFactory = require("./handleFactory");

exports.getAllPots = handleFactory.getAll(Model);

exports.createOnePot = handleFactory.createOne(Model);

exports.getOnePot = handleFactory.getOne(Model);

exports.updateOnePot = handleFactory.updateOne(Model);

exports.deleteOnePot = handleFactory.deleteOne(Model);
