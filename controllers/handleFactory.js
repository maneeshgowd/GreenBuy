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

exports.createOne = (Model, type = "no-filter") =>
  catchAsync(async (req, res, next) => {
    let filteredData = null;
    if (type === "cart" || type === "wishlist")
      filteredData = filteredBody(req.body, "products", "user");
    else
      filteredData = filteredBody(
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
