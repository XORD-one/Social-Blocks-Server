const express = require('express');
const router = express.Router();
const PostsController = require('../controllers/post_controller');

router.get('/getPosts', PostsController.getPosts);
router.get('/getUserPosts', PostsController.getUserPosts);
router.get('/getSinglePost/:id', PostsController.getSinglePost);

module.exports = {
  router: router,
};
