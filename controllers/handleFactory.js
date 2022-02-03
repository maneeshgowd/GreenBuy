const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");
const filteredBody = require("../utils/filter");

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let tempProduct = null;

    const id = req.params.productID || req.params.userID;

    if (!id.includes("-")) tempProduct = Model.findById(id || null);
    else tempProduct = Model.findOne({ slug: id } || null);

    const data = await tempProduct;

    if (!data) return next(new ApiError("No product found with the respected id!", 404));
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Model.find(), req.query).categories().price().ratings();
    const data = await features.query;

    res.status(200).json({
      status: "success",
      result: data.length,
      data: {
        data,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const filteredData = filteredBody(
      req.body,
      "plantName",
      "images",
      "about",
      "price",
      "ratings",
      "plantType"
    );

    if (Object.entries(filteredData).length === 0)
      return next(new ApiError("Please provide valid fields to update!", 400));

    const data = await Model.findByIdAndUpdate(
      req.params.productID || req.params.userID,
      filteredData,
      {
        runValidators: true,
        new: true,
      }
    );

    if (!data) return next(new ApiError("No product find with the given id!", 404));

    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.productID || req.params.userID);

    if (!data) return next(new ApiError("No product find with the given id!", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const filteredData = filteredBody(
      req.body,
      "plantName",
      "potName",
      "images",
      "about",
      "price",
      "ratings",
      "plantType"
    );

    const data = await Model.create(filteredData);

    res.status(201).json({
      status: "success",
      data: {
        data,
      },
    });
  });

exports.updateCartItem = (Model) =>
  catchAsync(async (req, res) => {
    const {type} = req.body;
    const find = await Model.findOne({ user: req.user._id });
    const product = [...find[type]];
    const itemRemove = req.body[type];
    const findItem = product.find((ele) => String(ele._id) === itemRemove);

    if (!findItem)
      return res.status(400).json({
        status: "fail",
        message: "Unable to delete item!",
      });

    const index = product.findIndex((item) => String(item._id) === itemRemove);
    product[index] = "";
    const newData = product.filter((item) => item);

    const update = await Model.findByIdAndUpdate(
      find._id,
      { [type]: newData },
      {
        runValidators: true,
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Item removed successfully!",
      data: {
        data: update,
      },
    });
  });

exports.createCartItem = (Model) =>
  catchAsync(async (req, res, next) => {
    const { type } = req.body;
    const find = await Model.findOne({ user: req.user._id });

    if (!find) {
      const cartItem = await Model.create({ [type]: req.body[type], user: req.user._id });

      res.status(200).json({
        status: "success",
        message: "Data added successfully!",
        data: {
          cartItem,
        },
      });
    } else {
      req.cartData = find;
      next();
    }
  });

exports.updateExisiting = (Model) =>
  catchAsync(async (req, res) => {
    const { type } = req.body;
    const data = filteredBody(req.body, type);
    const ID = req.cartData._id;
    const filter = [...req.cartData[type]].map((ele) => String(ele._id));
    const mergeData = { [type]: [...new Set([...filter, ...data[type]])] };

    const find = await Model.findByIdAndUpdate(ID, mergeData, {
      runValidators: true,
      new: true,
    });


    res.status(200).json({
      status: "success",
      data: {
        item: find,
      },
    });
  });
