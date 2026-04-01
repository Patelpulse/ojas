const bcrypt = require("bcrypt");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender, mobile, bio } = req.body;
        console.log("Register data:", req.body);
        if (!name || !email || !password || !gender || !mobile) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashpass = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashpass,
            gender,
            mobile,
            bio: bio || "New User"
        });


        console.log("User registered successfully:", user._id);
        res.status(201).json({ data: user });
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("------->", user)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        console.log("User logged in successfully:", user._id);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 });

        res.status(200).json({ data: user, token: token, message: "User logged in successfully" });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data: user, message: "User found successfully" });
    } catch (error) {
        console.error("Get user error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser, getUser };