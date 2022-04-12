const express = require('express');

const LikesController = require('../controllers/likes_controller');
const { verifySignature } = require('../middlewares');
const { createSignature } = require('../utils');

const router = express.Router();

router.post('/setlikes', verifySignature, LikesController.setLike);
router.post('/getlikes', LikesController.getLikes);

router.post('/getLikesHash', verifySignature, (req, res) => {
  const data = createSignature(req.body.likes);

  res.json(data);
});

/**
 * {
 *  signature: "",
 *  userAddress: "",
 *  likes: 23
 * }
 */

module.exports = {
  router: router,
};
