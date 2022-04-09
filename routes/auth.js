const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth_controller");

router.post("/register", AuthController.register);

module.exports = {
  router:router,
};
