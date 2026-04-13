const Product = require("../model/Product");
const Category = require("../model/Category");
const User = require("../model/user");
const Vendor = require("../model/Vendor");
const SubCategory = require("../model/SubCategory");
const imagekit = require("../config/imagekit");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Create Product (Vendor)
const createVendorProduct = async (req, res) => {
    try {
        const {
            name, title, price, discountPrice, description, shortDescription,
            category, subCategory, brand, stock, sku, lowStockThreshold,
            trackQuantity, weight, length, width, height, requiresShipping,
            seoTitle, seoDescription, slug, youtubeLink, status, visibility,
            attributes, specs, tags, variations
        } = req.body;

        let imageUrl = "";
        let galleryUrls = [];

        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                const uploadResponse = await imagekit.files.upload({
                    file: req.files.image[0].buffer.toString('base64'),
                    fileName: `product_${Date.now()}.png`,
                    folder: "/products",
                });
                imageUrl = uploadResponse.url;
            }

            if (req.files.gallery) {
                for (const file of req.files.gallery) {
                    const uploadResponse = await imagekit.files.upload({
                        file: file.buffer.toString('base64'),
                        fileName: `gallery_${Date.now()}.png`,
                        folder: "/products",
                    });
                    galleryUrls.push(uploadResponse.url);
                }
            }
        }

        const product = await Product.create({
            name, title, price, discountPrice, description, shortDescription,
            image: imageUrl,
            gallery: galleryUrls,
            category, subCategory, brand, stock, sku, lowStockThreshold,
            trackQuantity, 
            dimensions: { length, width, height },
            weight, requiresShipping,
            seoTitle, seoDescription, slug, youtubeLink, status, visibility,
            attributes: attributes ? JSON.parse(attributes) : {},
            variations: variations ? JSON.parse(variations) : [],
            specs: specs ? JSON.parse(specs) : [],
            tags: tags ? JSON.parse(tags) : [],
            user: req.user._id || req.user.id
        });

        res.status(201).json({ data: product, message: "Product created successfully" });
    } catch (error) {
        console.error("Vendor product creation error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Create Category (Vendor)
const createVendorCategory = async (req, res) => {
    try {
        const { name, description, parent } = req.body;

        let imageUrl = "";

        if (req.file) {
            const uploadResponse = await imagekit.files.upload({
                file: req.file.buffer.toString('base64'),
                fileName: `category_${Date.now()}.png`,
                folder: "/categories",
            });
            imageUrl = uploadResponse.url;
        }

        const category = await Category.create({
            name,
            description,
            parent: parent || "No parent (Main Category)",
            image: imageUrl,
            user: req.user.id
        });

        res.status(201).json({ data: category, message: "Category created successfully" });
    } catch (error) {
        console.error("Vendor category creation error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Get Vendor's Products
const getVendorProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id });
        res.status(200).json({ data: products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Product
const updateVendorProduct = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const product = await Product.findOne({ _id: req.params.id, user: userId });
        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }

        const updateData = { ...req.body };

        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                const uploadResponse = await imagekit.files.upload({
                    file: req.files.image[0].buffer.toString('base64'),
                    fileName: `product_${Date.now()}.png`,
                    folder: "/products",
                });
                updateData.image = uploadResponse.url;
            }

            if (req.files.gallery) {
                let galleryUrls = [];
                for (const file of req.files.gallery) {
                    const uploadResponse = await imagekit.files.upload({
                        file: file.buffer.toString('base64'),
                        fileName: `gallery_${Date.now()}.png`,
                        folder: "/products",
                    });
                    galleryUrls.push(uploadResponse.url);
                }
                updateData.gallery = galleryUrls;
            }
        }

        if (updateData.attributes) updateData.attributes = JSON.parse(updateData.attributes);
        if (updateData.variations) updateData.variations = JSON.parse(updateData.variations);
        if (updateData.specs) updateData.specs = JSON.parse(updateData.specs);
        if (updateData.tags) updateData.tags = JSON.parse(updateData.tags);
        
        if (updateData.length || updateData.width || updateData.height) {
            updateData.dimensions = {
                length: updateData.length || product.dimensions?.length,
                width: updateData.width || product.dimensions?.width,
                height: updateData.height || product.dimensions?.height
            };
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ data: updatedProduct, message: "Product updated successfully" });
    } catch (error) {
        console.error("Vendor product update error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete Product
const deleteVendorProduct = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const product = await Product.findOneAndDelete({ _id: req.params.id, user: userId });
        if (!product) {
            return res.status(404).json({ message: "Product not found or unauthorized" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Category (Vendor)
const updateVendorCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
        if (!category) {
            return res.status(404).json({ message: "Category not found or unauthorized" });
        }

        const { name, description, parent } = req.body;
        const updateData = { name, description, parent };

        if (req.file) {
            const uploadResponse = await imagekit.files.upload({
                file: req.file.buffer.toString('base64'),
                fileName: `category_${Date.now()}.png`,
                folder: "/categories",
            });
            updateData.image = uploadResponse.url;
        }

        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ data: updatedCategory, message: "Category updated successfully" });
    } catch (error) {
        console.error("Vendor category update error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete Category (Vendor)
const deleteVendorCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!category) {
            return res.status(404).json({ message: "Category not found or unauthorized" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Vendor's Categories
const getVendorCategories = async (req, res) => {
    try {
        const categories = await Category.find({ 
            $or: [
                { user: req.user.id }, 
                { user: "000000000000000000000000" }
            ] 
        }).sort({ createdAt: -1 });
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create SubCategory (Vendor)
const createVendorSubCategory = async (req, res) => {
    try {
        const { name, description, category, status } = req.body;
        const subCategory = await SubCategory.create({
            name,
            description,
            category,
            status: status || "active",
            user: req.user.id
        });
        res.status(201).json({ data: subCategory, message: "SubCategory created successfully" });
    } catch (error) {
        console.error("Vendor subcategory creation error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get Vendor's SubCategories
const getVendorSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ 
            $or: [
                { user: req.user.id },
                { user: "000000000000000000000000" } // System subcategories
            ]
        }).populate("category").sort({ createdAt: -1 });
        res.status(200).json({ data: subCategories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update SubCategory
const updateVendorSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found or unauthorized" });
        }
        res.status(200).json({ data: subCategory, message: "SubCategory updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete SubCategory
const deleteVendorSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found or unauthorized" });
        }
        res.status(200).json({ message: "SubCategory deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const vendorSignup = async (req, res) => {
    try {
        const { 
            firstName, lastName, email, phone, password,
            businessName, businessType, website, address, city, state, zipCode,
            description, categories, avgOrderValue, monthlyVolume, productDetails,
            taxId, bankAccount
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create User
        const user = await User.create({
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            mobile: phone,
            gender: "other", // Default or extract from somewhere if needed
            role: "vendor",
            bio: description || "Vendor"
        });

        let licenseUrl = "";
        if (req.file) {
            const uploadResponse = await imagekit.files.upload({
                file: req.file.buffer.toString('base64'),
                fileName: `license_${Date.now()}.png`,
                folder: "/vendor_docs",
            });
            licenseUrl = uploadResponse.url;
        }

        // Create Vendor Profile
        const vendor = await Vendor.create({
            user: user._id,
            businessName,
            businessType,
            website,
            address: {
                street: address,
                city,
                state,
                zipCode
            },
            description,
            categories: typeof categories === 'string' ? JSON.parse(categories) : categories,
            avgOrderValue,
            monthlyVolume,
            productDetails,
            documents: {
                license: licenseUrl,
                taxId,
                bankAccount
            },
            status: "pending"
        });

        res.status(201).json({ message: "Vendor application submitted successfully. Please wait for admin approval.", data: vendor });
    } catch (error) {
        console.error("Vendor signup error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Vendor Login
const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: "vendor" });
        if (!user) {
            return res.status(404).json({ message: "Vendor account not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const vendor = await Vendor.findOne({ user: user._id });
        if (!vendor || vendor.status !== "approved") {
            const status = vendor ? vendor.status : "not found";
            return res.status(403).json({ 
                message: `Your account is ${status}. You can access the dashboard once approved by the admin.` 
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });

        res.status(200).json({ 
            token, 
            data: user, 
            vendor,
            message: "LoggedIn successfully" 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get all vendor requests
const getAllVendorRequests = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate("user").sort({ createdAt: -1 });
        res.status(200).json({ data: vendors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update vendor status
const updateVendorStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["approved", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor request not found" });
        }

        res.status(200).json({ message: `Vendor status updated to ${status}`, data: vendor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVendorProduct,
    getVendorProducts,
    updateVendorProduct,
    deleteVendorProduct,
    createVendorCategory,
    updateVendorCategory,
    deleteVendorCategory,
    getVendorCategories,
    vendorSignup,
    vendorLogin,
    getAllVendorRequests,
    updateVendorStatus,
    createVendorSubCategory,
    getVendorSubCategories,
    updateVendorSubCategory,
    deleteVendorSubCategory
};
