const express = require("express");
const user_controller = require("../controllers/user_controller");
const { verifySignature } = require("../middlewares");
const router = express.Router();

router.get("/getAllUsers", user_controller.getAllUsers);
router.get("/details", user_controller.getUserDetails);
router.post("/follow", verifySignature, user_controller.followUser);
router.post("/unfollow", verifySignature, user_controller.unFollowUser);

module.exports = {
  router: router,
};
