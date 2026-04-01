const express = require("express");
const { registerUser, loginUser, logoutUser, getUser } = require("../controller/userController.js");
const auth = require("../middlewere/Auth.js");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", auth, logoutUser);
router.get("/profile", auth, getUser);

module.exports = router;