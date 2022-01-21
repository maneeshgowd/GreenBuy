const Products = require("../models/productModel");
const Pots = require("../models/potsModel");
// const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

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

exports.getWishlist = (req, res) => {
  // const wishlist = await Products.find();

  res.status(200).render("wishlist", {
    title: "GreenBuy | Wishlist",
  });
};

exports.getCart = (req, res) => {
  // const cart = await Products.find();

  res.status(200).render("cart", {
    title: "GreenBuy | Cart",
  });
};

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
