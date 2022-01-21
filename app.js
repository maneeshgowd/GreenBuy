const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const ApiError = require("./utils/apiError");
const userRoute = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");
const viewRoute = require("./routes/viewRoutes");
const wishlistRoute = require("./routes/wishlistRoutes");
const cartRoute = require("./routes/cartRoutes");
const potRoute = require("./routes/potsRoutes");
const errorController = require("./controllers/errorController");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/", viewRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/pots", potRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;
