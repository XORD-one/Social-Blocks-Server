const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const post = new Schema(
  {
    _id: String,
    creator: {
      id: String,
      address: String,
      userName: String,
      displayName: String,
      bio: String,
      image: String,
    },
    owner: {
      id: String,
      address: String,
      userName: String,
      displayName: String,
      bio: String,
      image: String,
    },
    name: String,
    description: String,
    buyStatus: Number,
    sellValue: Number,
    image: String,
    transferHistory: [String],
  },
  { timestamps: true, _id: false },
);

const Post = mongoose.model('post', post);

module.exports = Post;
