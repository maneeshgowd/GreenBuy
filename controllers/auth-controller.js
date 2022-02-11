const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const filterBody = require("../utils/filter");
const Email = require("../utils/email");

const randomOTPGenerator = () => Math.floor(Math.random() * 1000000 + 100001);

const signInToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

const createAndSendToken = (req, user, statusCode, res) => {
  const token = signInToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  res.cookie("jwt", token, cookieOptions);

  return res.status(statusCode).json({
    status: "success",
    message: "successfully signed!",
    token,
  });
};

exports.otp = catchAsync(async (req, res) => {
  const filteredData = filterBody(req.body, "name", "email");

  const email = await User.findOne({ email: filteredData.email });

  if (email)
    return res.status(401).json({
      status: "fail",
      message: "User already exists!",
    });

  let OTP = randomOTPGenerator();

  if (String(OTP).length === 7) {
    OTP = String(OTP).slice(0, -1);
  }

  const url = `${req.protocol}//:${req.get("host")}/`;

  await new Email(filteredData, url, OTP).sendOTP();

  res.status(200).json({
    status: "success",
    message: "OTP sent successfully!",
    OTP,
  });
});

exports.signup = catchAsync(async (req, res) => {
  const filteredData = filterBody(
    req.body,
    "name",
    "email",
    "password",
    "passwordConfirm",
    "role",
    "photo"
  );
  const user = await User.create(filteredData);
  createAndSendToken(req, user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new ApiError("Please enter email and password", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.validateUserPassword(password, user.password)))
    return next(new ApiError("Incorrect email or password", 401));

  createAndSendToken(req, user, 200, res);
});

exports.closeAccount = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  if (!password) return next(new ApiError("Please enter a password!", 400));

  const user = await User.findById(req.user._id).select("+password");

  if (!user || !(await user.validateUserPassword(password, user.password)))
    return next(new ApiError("Incorrect password", 401));

  await User.findByIdAndDelete(req.user._id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  let token = null;

  if (authorization && authorization.startsWith("Bearer")) token = authorization.split(" ")[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token) return next(new ApiError("Please login again!", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser)
    return next(
      new ApiError(
        "The token does no longer exists for the current user!, Please login again!",
        401
      )
    );

  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(new ApiError("User recently changed password, Please login again!", 401));

  req.user = freshUser;
  res.locals.user = freshUser;

  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new ApiError("There is no user with the given email address!", 404));

  // 2. Generate the random reset token

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // 3. send it to user's email

  try {
    await new Email(user, resetToken).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ApiError("There was an error sending the email. Try again later!", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on the token.
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. se the new pass if token has not expired and user includes
  if (!user) return next(new ApiError("Token is invalid, or alreasy expired!", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  createAndSendToken(req, user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // check if password is correct
  if (!(await user.validateUserPassword(req.body.passwordCurrent, user.password))) {
    return next(new ApiError("Invalid password, Please enter a valid password!"), 400);
  }

  // if pass true, update pass
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // login the user and send JWT
  createAndSendToken(req, user, 200, res);
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

exports.logoutUser = (req, res) => {
  res.cookie("jwt", "logged-out", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.restrict =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new ApiError("You do not have permission to perform this action!", 403));

    next();
  };
