const router = require("express").Router();
const potsController = require("../controllers/potsController");
const authController = require("../controllers/auth-controller");

router.route("/").get(potsController.getAllPots);


router.post("/",authController.protect, authController.restrict("admin", "seller"), potsController.createOnePot);

router
  .route("/:productID")
  .get(potsController.getOnePot)
  .patch(authController.protect, authController.restrict("admin", "seller"),potsController.updateOnePot)
  .delete(authController.protect, authController.restrict("admin", "seller"),potsController.deleteOnePot);

module.exports = router;
