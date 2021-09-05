const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userID: { type: String, required: true, unique: true },
  svgAvatar: { type: String, required: true },
  followers: { type: Number, required: true },
  following: { type: Number, required: true },
  followersIDs: { type: Array, required: true },
  followingIDs: { type: Array, required: true },
});

module.exports = mongoose.model("User", userSchema);
