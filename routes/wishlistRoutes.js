const router = require("express").Router();
const authController = require("../controllers/auth-controller");
const wishlistController = require("../controllers/wishlistController");

router.route("/").get(wishlistController.getAllWishlist);

router.use(authController.protect);

router.post("/", wishlistController.createWishlist);

router
  .route("/:productID")
  .get(wishlistController.getWishlist)
  .patch(wishlistController.updateWishlist)
  .delete(wishlistController.deleteWishlist);

module.exports = router;
