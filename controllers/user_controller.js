const User = require('../models/user');

const getAllUsers = async (_, res) => {
  try {
    const result = await User.find({});
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const result = await User.findOne({ address: req.query.address });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

const followUser = async (req, res) => {
  try {
    const followingPromise = User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followUser } },
      { new: true },
    );
    const followerPromise = User.findOneAndUpdate(
      { address: req.body.followUser },
      { $push: { followers: req.user.address } },
      { new: true },
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

const unFollowUser = async (req, res) => {
  try {
    const followingPromise = User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.followUser } },
      { new: true },
    );
    const followerPromise = User.findOneAndUpdate(
      { address: req.body.followUser },
      { $pull: { followers: req.user.address } },
      { new: true },
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

    if (!user) throw 'no user found';

    const userFollowers = await User.find({ address: { $in: user.followers } });

    res.status(200).json({
      user,
      data: userFollowers,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findOne({
      address: req.params.address.toLowerCase(),
    });

    if (!user) throw 'no user found';

    const userFollowing = await User.find({ address: { $in: user.following } });

    res.status(200).json({
      user,
      data: userFollowing,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  followUser,
  unFollowUser,
  getUserFollowers,
  getUserFollowing,
};
