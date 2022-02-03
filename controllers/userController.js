const multer = require("multer");
const sharp = require("sharp");
const Model = require("../models/userModel");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const handleFactory = require("./handleFactory");
const filteredBody = require("../utils/filter");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new ApiError("Not an image! Please upload only images.", 404), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`${__dirname}/../public/img/users/${req.file.filename}`);

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ApiError("This route is not for password updates, Please use /updatePassword", 400)
    );
  }

  const filteredData = filteredBody(req.body, "name", "email","postcode","country","address");
  if (req.file) filteredData.photo = req.file.filename;

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
