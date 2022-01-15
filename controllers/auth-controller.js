const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");

const signInToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

const createAndSendToken = (user, statusCode, res) => {
  const token = signInToken(user.id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      email: user.email,
      message: "successfully signed!",
    },
  });
};

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const user = await User.create({ name, email, password, passwordConfirm });
  createAndSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new ApiError("Please enter email and password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.validateUserPassword(password, user.password)))
    return next(new ApiError("Incorrect email or password", 401));

  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  let token = null;

  if (authorization && authorization.startsWith("Bearer")) token = authorization.split(" ")[1];

  if (!token) return next(new ApiError("Please login again!", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser)
    return next(new ApiError("The token does no longer exists for the current user!", 401));

  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(new ApiError("User recently changed password, Please login again!", 401));

  req.user = freshUser;

  next();
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // check if password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new ApiError("Invalid password, Please enter a valid password!"), 400);
  }

  // if pass true, update pass
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // login the user and send JWT
  createAndSendToken(user, 200, res);
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      // 3. check if user still exists
      const freshUser = await User.findById(decoded.id);

      if (!freshUser)
        return next(new ApiError("The token does no longer exists, for the current user!", 401));

      if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new ApiError("User recently changed password, Please login again!", 401));
      }

      res.locals.user = freshUser;
      return next();
    } catch (err) {
      return next();
    }
  }

  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // check if pass is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new ApiError("Invalid password, Please try again!", 404));

  // if correct update pass
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  // 4. log user in, send JWT
  createAndSendToken(user, 200, res);
});

exports.restrict =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new ApiError("You do not have permission to perform this action!", 403));
  };
