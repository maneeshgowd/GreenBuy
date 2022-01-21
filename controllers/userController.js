// const multer = require("multer");
const Model = require("../models/userModel");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const handleFactory = require("./handleFactory");
const filteredBody = require("../utils/filter");

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ApiError("This route is not for password updates, Please use /updatePassword", 400)
    );
  }

  const filteredData = filteredBody(req.body, "name", "email");
  if (req.file) filteredData.photo = req.file.filename;

  console.log(req.file);

  const user = await Model.findByIdAndUpdate(req.user.id, filteredData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await Model.findById(req.user._id);

  if (!user) return next(new ApiError("No user exists", 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getAllUsers = handleFactory.getAll(Model);
exports.getUser = handleFactory.getOne(Model);
exports.updateUser = handleFactory.updateOne(Model);
exports.deleteUser = handleFactory.deleteOne(Model);
