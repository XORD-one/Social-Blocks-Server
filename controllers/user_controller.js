const User = require("../models/user");
const Like = require("../models/likes");

const getRisingCreators = async (_, res) => {
  // try {
  //   const likes = (await Like.find({}))
  //     .sort((a, b) => Number(b.likesArray.length) - Number(a.likesArray.length))
  //     .slice(0, 4);
  //   console.log(
  //     "likse- ",
  //     likes,
  //     likes.map((like) => like.postId)
  //   );
  //   const users = await User.find({
  //     "postsOwn.id": { $in: likes.map((like) => like.postId) },
  //   });
  //   return res.status(200).json(users);
  // } catch (err) {
  //   console.log("err in new rp", err);
  //   res.status(500).json(err);
  // }
};

const followUser = async (req, res) => {
  try {
    const followingPromise = User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followUser } },
      { new: true }
    );

    let user = User.findOne({ address: req.body.address });
    let user1 = User.findOne({ address: req.body.followUser });

    if (!user) {
      user = new User(req.body.address, [], [req.body.followUser]);
    } else {
      user.following = user.following.push(req.body.followUser);
      user.save();
    }

    if (!user1) {
      user1 = new User(req.body.address, [req.body.address], []);
    } else {
      user1.followers = user.followers.push(req.body.address);
      user1.save();
    }

    res.status(200).json({
      user,
      user1,
    });
  } catch (error) {
    console.log(error);
  }
};

const unFollowUser = async (req, res) => {
  try {
    const followingPromise = User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.followUser } },
      { new: true }
    );
    const followerPromise = User.findOneAndUpdate(
      { address: req.body.followUser },
      { $pull: { followers: req.user.address } },
      { new: true }
    );

    const [following, follower] = await Promise.all([
      followingPromise,
      followerPromise,
    ]);

    res.status(200).json({
      following,
      follower,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserFollowers = async (req, res) => {
  try {
    const user = await User.findOne({
      address: req.params.address.toLowerCase(),
    });

    if (!user) {
      res.status(200).json({
        data: [],
      });
    } else {
      res.status(200).json({
        data: user.following,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findOne({
      address: req.params.address.toLowerCase(),
    });

    if (!user) {
      res.status(200).json({
        data: [],
      });
    } else {
      res.status(200).json({
        data: user.following,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  followUser,
  unFollowUser,
  getUserFollowers,
  getUserFollowing,
  getRisingCreators,
};
