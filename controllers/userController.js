const User = require("../models/userModel");

const createUser = async (req, res) => {
  console.log("Helll");
  console.log(req.body);
  const {
    name,
    email,
    userID,
    svgAvatar,
    followers,
    following,
    followersIDs,
    followingIDs,
  } = req.body;
  //   let existingUser;
  //   try {
  //     existingUser = await User.findOne({ email: email });
  //   } catch (err) {
  //     res.status(500);
  //     const error = new Error("Signing up failed, please try again later.");
  //     return next(error);
  //   }

  //   if (existingUser) {
  //     const error = new HttpError(
  //       "User exists already, please login instead.",
  //       422
  //     );
  //     return next(error);
  //   }
  const newUser = new User({
    name,
    email,
    userID,
    svgAvatar,
    followers,
    following,
    followersIDs,
    followingIDs,
  });

  await newUser.save();
  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const userProfile = async (req, res) => {
  const uid = req.params.uid;

  User.findOne({ userID: uid }, (err, response) => {
    if (err) return handleError(err);
    // Prints "Space Ghost is a talk show host".
    console.log(response);
    res.send(response);
  });
};

exports.createUser = createUser;
exports.userProfile = userProfile;
