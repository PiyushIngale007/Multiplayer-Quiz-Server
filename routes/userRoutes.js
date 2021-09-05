const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userController");
const User = require("../models/userModel");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
} = require("../authenticate");

router.post("/signup", (req, res, next) => {
  // Verify that first name is not empty
  const { username, name, email } = req.body;

  if (!req.body.name) {
    res.statusCode = 500;
    res.send({
      name: "NameError",
      message: "The name is required",
    });
  } else {
    User.register(
      new User({
        username,
        name,
        email,
      }),
      req.body.password,
      (err, user) => {
        if (err) {
          console.log("ERROR");
          res.statusCode = 500;
          res.send(err);
        } else {
          //   user.name = req.body.name;
          //   user.email = req.body.email;
          //   user.followers = 0;
          //   user.following = 0;
          //   user.followersIDs = [];
          //   user.followingIDs = [];
          console.log(user);
          const token = getToken({ _id: user._id });
          const refreshToken = getRefreshToken({ _id: user._id });
          user.refreshToken.push({ refreshToken });
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.send(err);
            } else {
              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
              res.send({ success: true, token });
            }
          });
        }
      }
    );
  }
});
router.post("/", userControllers.createUser);

router.get("/profile/:uid", userControllers.userProfile);

module.exports = router;
