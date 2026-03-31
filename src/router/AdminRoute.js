const express = require("express");
const { registerAdmin, loginAdmin, logoutAdmin, getAdmin } = require("../controller/AdminController.js");
const Adminauth = require("../middlewere/AdminAuth.js");
const { postCategories, getCategories } = require("../controller/Homecontroller.js");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", Adminauth, logoutAdmin);
router.get("/me", Adminauth, getAdmin);

// Category routes (Admin task)
router.post("/category", Adminauth, postCategories);
router.get("/category", Adminauth, getCategories);

module.exports = router;
