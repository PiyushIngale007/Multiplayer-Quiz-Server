const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
});

const userSchema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // email: { type: String, required: true, unique: true },
  // svgAvatar: { type: String, required: true },
  // followers: { type: Number, required: true },
  // following: { type: Number, required: true },
  // followersIDs: { type: Array, required: true },
  // followingIDs: { type: Array, required: true },
  refreshToken: {
    type: [Session],
  },
});

//Remove refreshToken from the response
userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.refreshToken;
    return ret;
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
