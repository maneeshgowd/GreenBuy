const route = require("express").Router();
const authController = require("../controllers/auth-controller");
const userController = require("../controllers/userController");

route.post("/signup", authController.signup);
route.post("/validate", authController.otp);
route.post("/login", authController.login);
route.get("/logout", authController.protect, authController.logoutUser);

// forgot and reset password

route.use(authController.protect);
route.get("/me", authController.restrict("user", "admin"), userController.getMe);
route.patch(
  "/updateMyPassword",
  authController.restrict("user", "admin"),
  authController.updatePassword
);
route.patch("/updateMe", authController.restrict("user", "admin"), userController.updateMe);
route.delete("/deleteMe", authController.restrict("user", "admin"), userController.deleteUser);

route.get("/", authController.restrict("admin"), userController.getAllUsers);
route
  .route("/:userID")
  .get(authController.restrict("admin"), userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.restrict("admin"), userController.deleteUser);

module.exports = route;
