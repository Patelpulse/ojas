const express = require("express");
const { registerAdmin, loginAdmin, logoutAdmin, getAdmin } = require("../controller/AdminController.js");
const Adminauth = require("../middlewere/AdminAuth.js");
const { postCategories, getCategories, deleteCategory } = require("../controller/Homecontroller.js");
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controller/Product.js");
const upload = require("../middlewere/Upload.js");


const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", Adminauth, logoutAdmin);
router.get("/profile", Adminauth, getAdmin);

// Category routes (Admin task)
router.post("/category", Adminauth, postCategories);
router.get("/category", Adminauth, getCategories);
router.delete("/category/:id", Adminauth, deleteCategory);

// Product routes (Admin task)
router.post("/product", Adminauth, upload.single("image"), createProduct);
router.get("/product", Adminauth, getProducts);
router.get("/product/:id", Adminauth, getProduct);
//router.put("/product/:id", Adminauth, upload.single("image"), updateProduct);

router.delete("/product/:id", Adminauth, deleteProduct);

module.exports = router;
