const router = require("express").Router();
const authController = require("../controllers/auth-controller");
const productController = require("../controllers/productController");

router.route("/").get(productController.getAllProducts);

router.post(
  "/",
  authController.protect,
  authController.restrict("admin", "seller"),
  productController.createOneProduct
);

router
  .route("/:productID")
  .get(productController.getOneProduct)
  .patch(
    authController.protect,
    authController.restrict("admin", "seller"),
    productController.updateOneProduct
  )
  .delete(
    authController.protect,
    authController.restrict("admin", "seller"),
    productController.deleteOneProduct
  );

module.exports = router;
