const router = require("express").Router();
const viewController = require("../controllers/viewController");
// const authController = require("../controllers/auth-controller");

// router.use(authController.isLoggedIn);

router.route("/").get(viewController.overview);
router.route("/login").get(viewController.login);
router.route("/signup").get(viewController.signup);
router.route("/products").get(viewController.getAllProducts);
router.route("/cart").get(viewController.getCart);
router.route("/wishlist").get(viewController.getWishlist);
router.route("/my-account").get(viewController.user);

router.get("/:productID", viewController.getProduct);

module.exports = router;
