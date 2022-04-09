const express = require('express');

const LikesController = require('../controllers/likes_controller');
const { verifySignature } = require('../middlewares');

const router = express.Router();

router.post('/setlikes', verifySignature, LikesController.setLike);
router.post('/getlikes', LikesController.getLikes);

module.exports = {
  router: router,
};
