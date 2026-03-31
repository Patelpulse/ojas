const Admin = require("../model/Admin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const hashpass = await bcrypt.hash(password, 10);
        const admin = await Admin.create({
            name,
            email,
            password: hashpass,
        });
        console.log("Admin registered successfully:", admin._id);
        res.status(201).json({ data: admin });
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        console.log("Admin logged in successfully:", admin._id);
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("Admintoken", token, { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 });
        res.status(200).json({ data: admin, token: token });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("Admintoken");
        res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ data: admin });
    } catch (error) {
        console.error("Get admin error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerAdmin, loginAdmin, logoutAdmin, getAdmin };