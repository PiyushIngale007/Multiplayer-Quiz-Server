const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userController");
const userAuthControllers = require("../controllers/userAuthController");

const passport = require("passport");

const { verifyUser } = require("../authenticate");

router.post("/signup", userAuthControllers.userSignup);

router.post(
  "/login",
  passport.authenticate("local"),
  userAuthControllers.userLogin
);

router.post("/refreshToken", userAuthControllers.refreshToken);

router.get("/logout", verifyUser, userAuthControllers.userLogout);

router.post("/", userControllers.createUser);

router.get("/profile", verifyUser, (req, res, next) => {
  res.send(req.user);
});

router.get("/profile/:uid", userControllers.userProfile);

module.exports = router;
