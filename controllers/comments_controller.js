const Comment = require("../models/Comment");
const Post = require("../models/post");

const setComment = async (req, res) => {
  let post = await Post.findOne({ _id: req.body.postId });

  if (post) {
    let comment = new Comment({
      postId: req.body.postId,
      comment: req.body.comment,
      userAddress: req.user.address,
      userName: req.user.userName,
    });
    await comment.save();
    res.json({
      comment: comment,
    });
  } else {
    res.json({
      message: "post id does not exists.",
    });
  }
};

const getComments = async (req, res) => {
  let comments = await Comment.find({
    postId: req.params.id,
  });
  if (comments) {
    res.json({
      comments: comments,
    });
  } else {
    res.json({
      comments: [],
    });
  }
};

module.exports = {
  setComment,
  getComments,
};
