const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userChanges = new Schema(
  {
    count: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const UserChanges = mongoose.model("userChanges", userChanges);

module.exports = UserChanges;
