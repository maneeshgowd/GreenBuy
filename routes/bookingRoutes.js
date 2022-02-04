const router = require("express").Router();
 
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/auth-controller");

router.use(authController.protect);

router.post(
  "/checkout-session",
  bookingController.getCheckOutSession
);
 
router.route("/").get(bookingController.getAllBooking)

router.use(authController.restrict("admin", "seller"));
router
  .route("/:productID")
  .get(bookingController.getBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
