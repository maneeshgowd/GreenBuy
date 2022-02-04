const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ProductModel = require("../models/productModel");
const PotModel = require("../models/potsModel");
const catchAsync = require("../utils/catchAsync");
const handleFactory = require("./handleFactory");
const Booking = require("../models/bookingModel");
const User = require("../models/userModel");

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

  pot.shift("pot");
  const id = [...product, ...pot].join("-");

  // 2. create the checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/products/`,
    customer_email: req.user.email,
    client_reference_id: req.user._id,
    product_details_id: id,
    line_items: newData,
  });

  res.status(200).json({
    status: "success",
    url: session.url,
  });
});

const createBookingCheckout = async function (session) {
  const id = session.product_details_id.split("pot");
  const product = id[0].split("-");
  const pot = id[1].split("-");

  const price = session.line_items.reduce((acc, amt) => acc + amt.amount / 100, 0);
  const quantity = session.line_items.reduce((acc, qun) => acc + qun.quantity, 0);

  await Booking.create({ product, pot, user: session.client_reference_id, price, quantity });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.consttructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout-session-completed") createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.getBooking = handleFactory.getOne(Booking);
exports.getAllBooking = handleFactory.getAll(Booking);
exports.deleteBooking = handleFactory.deleteOne(Booking);
