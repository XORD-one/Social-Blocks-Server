const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema(
  {
    address: String,
    userName: String,
    displayName: String,
    bio: String,
    image: String,
    rewardClaimed: String,
    postsCreated: [{ id: String }],
    postsOwn: [{ id: String }],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model('user', user);

module.exports = User;
