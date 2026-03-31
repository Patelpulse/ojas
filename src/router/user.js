const express = require("express");
const { registerUser, loginUser, logoutUser, getUser } = require("../controller/userController.js");
const auth = require("../middlewere/Auth.js");

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", auth, logoutUser);
router.get("/me", auth, getUser);

module.exports = router;