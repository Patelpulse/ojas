const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        businessName: {
            type: String,
            required: true,
            trim: true,
        },
        businessType: {
            type: String,
            required: true,
        },
        website: {
            type: String,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
        },
        description: {
            type: String,
        },
        categories: [{
            type: String,
        }],
        avgOrderValue: {
            type: String,
        },
        monthlyVolume: {
            type: String,
        },
        productDetails: {
            type: String,
        },
        documents: {
            license: String, // URL to image/pdf
            taxId: String,
            bankAccount: String,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Vendor", vendorSchema);
