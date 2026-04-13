const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        
        mobile: {
            type: String,
            required: [true, "Mobile number is required"],
            unique: true,
        },

        bio: {
            type: String,
            default: "Shopping Enthusiast",
        },


        photo: {
            type: String, // store URL (Cloudinary / local path)
            default: "",
        },
        
        role: {
            type: String,
            enum: ["user", "admin", "vendor"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);