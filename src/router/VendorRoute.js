const express = require("express");
const { 
    createVendorProduct, 
    getVendorProducts, 
    updateVendorProduct, 
    deleteVendorProduct,
    createVendorSubCategory,
    getVendorSubCategories,
    updateVendorSubCategory,
    deleteVendorSubCategory,
    createVendorCategory,
    getVendorCategories,
    updateVendorCategory,
    deleteVendorCategory,
    vendorSignup,
    vendorLogin
} = require("../controller/VendorController");
const vendorAuth = require("../middlewere/VendorAuth");
const upload = require("../middlewere/Upload");

const router = express.Router();

router.post("/product", vendorAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 5 }]), createVendorProduct);
router.get("/products", vendorAuth, getVendorProducts);
router.put("/product/:id", vendorAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 5 }]), updateVendorProduct);
router.delete("/product/:id", vendorAuth, deleteVendorProduct);
router.post("/category", vendorAuth, upload.single('image'), createVendorCategory);
router.get("/category", vendorAuth, getVendorCategories);
router.put("/category/:id", vendorAuth, upload.single('image'), updateVendorCategory);
router.delete("/category/:id", vendorAuth, deleteVendorCategory);

router.post("/subcategory", vendorAuth, createVendorSubCategory);
router.get("/subcategory", vendorAuth, getVendorSubCategories);
router.put("/subcategory/:id", vendorAuth, updateVendorSubCategory);
router.delete("/subcategory/:id", vendorAuth, deleteVendorSubCategory);

// Signup & Login
router.post("/signup", upload.single('license'), vendorSignup);
router.post("/login", vendorLogin);

module.exports = router;
