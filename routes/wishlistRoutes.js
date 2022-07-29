const router = require("express").Router();
const authController = require("../controllers/auth-controller");
const wishlistController = require("../controllers/wishlistController");

router.use(authController.protect);

router.route("/").get(wishlistController.getAllWishlist);
router.post("/", wishlistController.createWishlist, wishlistController.updateExisiting);
router.patch("/updateWishlistItem", wishlistController.updateWishlistItem);

router
  .route("/:productID")
  .get(wishlistController.getWishlist)
  .patch(wishlistController.updateWishlist)
  .delete(wishlistController.deleteWishlist);

module.exports = router;
