const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ProductModel = require("../models/productModel");
const PotModel = require("../models/potsModel");
const catchAsync = require("../utils/catchAsync");
const handleFactory = require("./handleFactory");
const Booking = require("../models/bookingModel");

const filterVal = function (data) {
  const prod = [];
  const pot = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "product") prod.push(data[i].id);
    if (data[i].type === "pot") pot.push(data[i].id);
  }

  return [prod, pot];
};

const combineData = function (prod, pot, data) {
  const newData = [...prod, ...pot];
  const finalCheckout = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < newData.length; i++) {
    finalCheckout.push({
      name: newData[i].plantName || newData[i].potName,
      images: [newData[i].images[0]],
      amount: newData[i].price * 100,
      currency: "inr",
      quantity: data[i].quantity,
    });
  }

  return finalCheckout;
};

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  const [product, pot] = filterVal(req.body.product);

  const products = await ProductModel.find({ _id: { $in: product } });
  const pots = await PotModel.find({ _id: { $in: pot } });
  const newData = combineData(products, pots, req.body.product);

  const id = [...product, ...pot].join("-");

  // 2. create the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/products/`,
    customer_email: req.user.email,
    client_reference_id: id,
    line_items: newData,
  });

  res.status(200).json({
    status: "success",
    url: session.url,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { products, user, price, quantity } = req.query;
  if (!products && !user && !price && !quantity) return next();

  await Booking.create({ products, user, price, quantity });

  res.redirect(req.originalURL.split("?")[0]);
});

exports.createBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.create({
    product: req.body.product,
    pot: req.body.pot,
    user: req.user._id,
    price: req.body.price,
    quantity: req.body.quantity,
  });

  res.status(201).json({
    status: "success",
    data: {
      booking,
    },
  });
});
exports.getBooking = handleFactory.getOne(Booking);
exports.getAllBooking = handleFactory.getAll(Booking);
exports.deleteBooking = handleFactory.deleteOne(Booking);
