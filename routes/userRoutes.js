const route = require("express").Router();

const authController = require("../controllers/auth-controller");

route.post("/signup", authController.signup);
route.post("/login", authController.login);

module.exports = route;
