const Products = require("../models/productModel");
const Pots = require("../models/potsModel");
const Cart = require("../models/cartModel");
const Wishlist = require("../models/wishlistModel");
// const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const Booking = require("../models/bookingModel");

exports.overview = (req, res) => {
  res.status(200).render("overview", {
    title: "GreenBuy",
  });
};

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Products.find();
  res.status(200).render("products", {
    title: "GreenBuy | Products",
    products,
  });
});

exports.getAllPots = catchAsync(async (req, res, next) => {
  const pots = await Pots.find();
  res.status(200).render("pots", {
    title: "GreenBuy | Pots",
    pots,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Products.findOne({ slug: req.params.productID } || null);
  if (!product) return next();

  res.status(200).render("product", {
    title: "GreenBuy | Plant",
    product,
  });
});

exports.getWishlist = catchAsync(async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.user._id });
  res.status(200).render("wishlist", {
    title: "GreenBuy | Wishlist",
    wishlist,
  });
});

exports.getCart = catchAsync(async (req, res) => {
  const cart = await Cart.find({ user: req.user._id });
  res.status(200).render("cart", {
    title: "GreenBuy | Cart",
    cart,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "GreenBuy | Login",
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "GreenBuy | Signup",
  });
});

exports.user = catchAsync(async (req, res, next) => {
  res.status(200).render("user", {
    title: "GreenBuy | User",
  });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id });
  res.status(200).json({
    status: "success",
    data: { bookings },
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;

  if (alert === "booking")
    res.locals.alert = "Your booking was successful!, Please check your email for a confirmation.";

  next();
};
