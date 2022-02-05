const express = require("express");
const path = require("path");
const compression = require("compression");
const hpp = require("hpp");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require('body-parser');
// const ApiError = require("./utils/apiError");
const userRoute = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");
const viewRoute = require("./routes/viewRoutes");
const wishlistRoute = require("./routes/wishlistRoutes");
const cartRoute = require("./routes/cartRoutes");
const potRoute = require("./routes/potsRoutes");
const bookingRoute = require("./routes/bookingRoutes");
const errorController = require("./controllers/errorController");
const bookingController = require("./controllers/bookingController");

const app = express();

app.enable("trust proxy");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// serving static files
app.use(express.static(path.join(__dirname, "public")));

// set security HTPP headers
app.use(helmet());

// Allow-access-control-allow-origin *
app.use(cors());

app.options("*", cors());

// needs body in raw form
app.post(
  "/webhook-checkout",
  bodyParser.raw({ type: "application/json" }),
  bookingController.webhookCheckout
);

// body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSql query injecitgon
app.use(mongoSanitize());

// data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["categories", "ratings", "price"],
  })
);

app.use(compression());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// limit requests from same API

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use("/", viewRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/pots", potRoute);
app.use("/api/v1/bookings", bookingRoute);

app.all("*", (req, res, next) => {
  // next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
  res.status(404).render("invalid");
});

app.use(errorController);

module.exports = app;
