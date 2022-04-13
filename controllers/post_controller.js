<<<<<<< Updated upstream
const Likes = require('../models/likes');
const Post = require('../models/post');
const User = require('../models/user');
=======
const Likes = require("../models/likes");
const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/Comment");
const axios = require("axios");
const { json } = require("body-parser");
>>>>>>> Stashed changes

// const URL = 'https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks';

const getPosts = async (req, res) => {
  try {
    const user = await User.findOne({
      address: req.params.address.toLowerCase(),
    });
    let result;
    if (user) {
      result = await Post.find({
        $or: [
          {
            'owner.address': {
              $in: [...user.following, req.params.address.toLowerCase()],
            },
          },
          {
            'creator.address': {
              $in: [...user.following, req.params.address.toLowerCase()],
            },
          },
        ],
      }).lean();
    } else {
      result = await Post.find({}).lean();
    }

    const checkLikes = await Likes.find({});

    result = result.map(post => {
      let likesArray = [];
      checkLikes.map(like => {
        if (parseInt(like.postId) === parseInt(post._id)) {
          likesArray = like.likesArray;
        }
      });
      return { ...post, likesArray };
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

const getUserPosts = async (req, res) => {
  try {
    const query =
      req.query.type === 'owner'
        ? { 'owner.id': req.query.address }
        : req.query.type === 'creator'
        ? { 'creator.id': req.query.address }
        : {
            $or: [
              { 'creator.id': req.query.address },
              { 'owner.id': req.query.address },
            ],
          };

    let result = await Post.find(query).lean();
    const checkLikes = await Likes.find({});

    result = result.map(post => {
      let likesArray = [];
      checkLikes.map(like => {
        if (parseInt(like.postId) === parseInt(post._id)) {
          likesArray = like.likesArray;
        }
      });
      return { ...post, likesArray };
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

const getSinglePost = async (req, res) => {
  try {
    let post = await Post.findOne({ _id: req.params.id });
    let checkLikes = await Likes.findOne({ postId: req.params.id });

    post = {
      ...post,
      likesArray: checkLikes ? checkLikes.likesArray : [],
    };

    res.status(200).json(post);
  } catch (err) {
    console.log(err);
  }
};

const removeAllPostsAndUsers = async (req, res) => {
  try {
    await Post.deleteMany({});
<<<<<<< Updated upstream
    res.status(200).json({ message: 'All posts deleted' });
=======
    await User.deleteMany({});
    await Likes.deleteMany({});
    await Comment.deleteMany({});

    res.status(200).json({ message: "All posts deleted" });
>>>>>>> Stashed changes
  } catch (err) {
    console.log(err);
  }
};

const getTransferHistory = async (req, res) => {
  let id = req.params.id;

  const result = await axios.post(
    "https://api.thegraph.com/subgraphs/name/ijlal-ishaq/social-blocks-subgraph",
    {
      query: `
      {
        posts(where:{id:"0x${id}"}){
          transferHistory
        }
      }
    `,
    }
  );

  let transferArr = result?.data?.data?.posts[0]?.transferHistory;

  if (transferArr) {
    let users = await User.find({
      address: {
        $in: transferArr,
      },
    });
    let usersInOrder = [];

    if (users) {
      users.forEach((user) => {
        usersInOrder[transferArr.indexOf(user.address.toLowerCase())] = user;
      });
    }

    res.json({
      usersInOrder,
    });
  } else {
    res.json({ message: "post not found." });
  }
};

module.exports = {
  getPosts: getPosts,
  getUserPosts: getUserPosts,
  getSinglePost,
  removeAllPostsAndUsers,
  getTransferHistory,
};
