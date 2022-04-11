const mongoose = require("mongoose");
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
        type: String,
        ref: "user",
      },
    ],
    following: [
      {
        type: String,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", user);

module.exports = User;
