const router = require("express").Router();
const authController = require("../controllers/auth-controller");
const cartController = require("../controllers/cartController");


router.use(authController.protect);

router.route("/").get(cartController.getAllCartItems);
router.post("/", cartController.createCartItem);

router
  .route("/:productID")
  .get(cartController.getCartItem)
  .patch(cartController.updateCartItem)
  .delete(cartController.deleteCartItem);

module.exports = router;
