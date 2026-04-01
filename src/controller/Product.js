const Product = require("../model/Product.js");
const imagekit = require("../config/imagekit.js");
const multer = require("multer");
const createProduct = async (req, res) => {

    try {
        if (!req.admin || !req.admin.id) {
            return res.status(401).json({ message: "Admin context missing. Please login again." });
        }
        console.log("console_1");
        const { name, title, price, description, category, stock, rating, numReviews } = req.body;
        console.log("console_2", req.body);
        let imageUrl = "";
        if (req.file) {
            console.log("File received:", req.file.originalname);
            try {
                // Use .files.upload for @imagekit/nodejs v7.x
                const uploadResponse = await imagekit.files.upload({
                    file: req.file.buffer.toString('base64'),
                    fileName: `product_${Date.now()}.png`,
                    folder: "/products",
                });
                imageUrl = uploadResponse.url;


                console.log("Upload Success:====>", imageUrl);
            } catch (imageKitError) {
                console.error("Full ImageKit error:", imageKitError);
                return res.status(500).json({
                    message: "Image upload failed",
                    error: imageKitError
                });
            }
        }


        if (!name || !title || !price || !description || !category || !stock || !rating || !numReviews) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const product = await Product.create({
            name,
            title,
            price,
            description,
            image: imageUrl,
            category,
            stock,
            rating,
            numReviews,
            user: req.admin.id
        });


        res.status(201).json({ data: product, message: "Product created successfully" });
    } catch (error) {
        console.error("Product creation error stack:", error.stack);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};



const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ data: products });
    } catch (error) {
        console.error("Product retrieval error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ data: product });
    } catch (error) {
        console.error("Product retrieval error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, title, price, description, category, stock, rating, numReviews } = req.body;

        let updateData = {
            name,
            title,
            price,
            description,
            category,
            stock,
            rating,
            numReviews,
            user: req.admin.id
        };


        if (req.file) {
            const uploadResponse = await imagekit.files.upload({
                file: req.file.buffer.toString('base64'),
                fileName: `product_${Date.now()}.png`,
                folder: "/products",
            });
            updateData.image = uploadResponse.url;
        }


        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ data: product, message: "Product updated successfully" });
    } catch (error) {
        console.error("Product update error:", error.message);
        res.status(500).json({ message: error.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: product, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Product deletion error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProduct, getProducts, getProduct, updateProduct, deleteProduct };