const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userController");

router.post("/", userControllers.createUser);

router.get("/profile/:uid", userControllers.userProfile);

module.exports = router;
