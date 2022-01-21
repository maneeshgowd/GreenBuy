const router = require("express").Router();
const viewController = require("../controllers/viewController");
const authController = require("../controllers/auth-controller");

router.route("/signup").get(viewController.signup);
router.route("/login").get(viewController.login);

router.route("/").get(authController.isLoggedIn, viewController.overview);
router.route("/products").get(authController.isLoggedIn, viewController.getAllProducts);
router.route("/pots").get(authController.isLoggedIn, viewController.getAllPots);

router.route("/cart").get(authController.protect, viewController.getCart);
router.route("/wishlist").get(authController.protect, viewController.getWishlist);
router.route("/my-account").get(authController.protect, viewController.user);

router.get("/:productID", authController.isLoggedIn, viewController.getProduct);

module.exports = router;
