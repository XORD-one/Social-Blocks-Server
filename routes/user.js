const express = require('express');
const user_controller = require('../controllers/user_controller');
const { verifySignature } = require('../middlewares');
const router = express.Router();

router.get('/getAllUsers', user_controller.getAllUsers);
router.get('/details', user_controller.getUserDetails);
router.post('/follow', verifySignature, user_controller.followUser);
router.post('/unfollow', verifySignature, user_controller.unFollowUser);
router.get('/getFollowers', user_controller.getUserFollowers);
router.get('/getFollowing', user_controller.getUserFollowing);

module.exports = {
  router: router,
};
