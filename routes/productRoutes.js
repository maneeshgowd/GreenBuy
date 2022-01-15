const router = require("express").Router();
const authController = require("../controllers/auth-controller");
const productController = require("../controllers/productController");

router.route("/").get(productController.getAllProducts);

router.use(authController.protect);

router.post("/", productController.createOneProduct);

router
  .route("/:productID")
  .get(productController.getOneProduct)
  .patch(productController.updateOneProduct)
  .delete(productController.deleteOneProduct);


module.exports = router;
