const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postChanges = new Schema(
  {
    count: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const PostChanges = mongoose.model("postChanges", postChanges);

module.exports = PostChanges;
