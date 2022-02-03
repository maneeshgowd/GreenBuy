const router = require("express").Router();
const authController = require("../controllers/auth-controller");
const cartController = require("../controllers/cartController");

router.use(authController.protect);

router.route("/").get(cartController.getAllCartItems);
router.post("/", cartController.createCartItem, cartController.updateExisiting);
router.patch("/updateCartItem", cartController.updateCartItem);

router
  .route("/:productID")
  .get(cartController.getCartItem)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCartItem);

module.exports = router;
