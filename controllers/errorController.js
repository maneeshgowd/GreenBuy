const ApiError = require("../utils/apiError");

const errorForDev = function (err, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    console.log(`${err} 🔥🔥🔥🔥`);

    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(err.statusCode).json({
    title: "Something went wrong!",
    stack: err.stack,
    message: err.message,
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((er) => er.message);
  const errMessage = `Invalid input data. ${error.join(".")}`;
  return new ApiError(errMessage, 400);
};

const handleTokenError = () => new ApiError("Invalid token, Please login again!", 401);

const handleTokenExpiredError = () =>
  new ApiError("Your token has expires, Please login again!", 401);

const handleDuplicateField = (err) => {
  const { name } = err.keyValue;
  const message = `Duplicate field value: "${name}", Please another value!`;
  return new ApiError(message, 400);
};

const errorForProd = function (err, req, res) {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      if (err.message.includes("Please login again!"))
      return res.redirect(`${req.protocol}://${req.get("host")}/login`);
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.error(`${JSON.stringify(err)} 🔥🔥🔥🔥🔥1`);

    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }

  if (err.isOperational) {
 
    if (err.message.includes("Please login again!"))
      return res.redirect(`${req.protocol}://${req.get("host")}/login`);
    return res.status(err.statusCode).json({
      title: "Something went wrong!",
      message: err.message,
    });
  }

  console.error(`${JSON.stringify(err)} 🔥🔥🔥🔥🔥2`);
  // generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later!",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") errorForDev(err, req, res);
  if (process.env.NODE_ENV === "production") {
    let newErr = { ...err };
    newErr.message = err.message;

    if (err.name === "CastError") newErr = handleCastErrorDB(newErr);
    if (err.code === 11000) newErr = handleDuplicateField(newErr);
    if (err.name === "validationError") newErr = handleValidationErrorDB(newErr);
    if (err.name === "JsonWebTokenError") newErr = handleTokenError();
    if (err.name === "TokenExpiredError") newErr = handleTokenExpiredError();
    errorForProd(newErr, req, res);
  }
};
