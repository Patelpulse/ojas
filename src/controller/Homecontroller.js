const Category = require("../model/Category.js");

const postCategories = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        const category = await Category.create({ name });
        res.status(201).json({
            data: category,
            message: "Category created successfully"
        });
    } catch (error) {
        console.error("Post categories error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ data: categories });
    } catch (error) {
        console.error("Get categories error:", error.message);
        res.status(500).json({ message: error.message });
    }
};
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        res.status(200).json({
            data: category,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Delete category error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json({
            data: category,
            message: "Category updated successfully"
        });
    } catch (error) {
        console.error("Update category error:", error.message);
        res.status(500).json({ message: error.message });
    }
};
module.exports = { postCategories, getCategories, deleteCategory, updateCategory };
