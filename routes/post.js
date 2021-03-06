const express = require("express");
const router = express.Router();
const PostsController = require("../controllers/post_controller");

router.get("/getPosts/:address", PostsController.getPosts);
router.get("/getUserPosts", PostsController.getUserPosts);
router.get("/getSinglePost/:id", PostsController.getSinglePost);
// router.get("/delete", PostsController.removeAllPostsAndUsers);
router.get("/getTransferHistory/:id", PostsController.getTransferHistory);

module.exports = {
  router: router,
};
