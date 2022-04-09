const User = require('../models/user');

const getAllUsers = async (req, res) => {
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
      { $push: { following: req.body.userId } },
      { new: true },
    );
    const followerPromise = User.findByIdAndUpdate(
      req.body.userId,
      { $push: { followers: req.user._id } },
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

module.exports = {
  getAllUsers,
  getUserDetails,
  followUser,
};
